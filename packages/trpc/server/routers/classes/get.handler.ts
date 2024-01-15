import { strip } from "@quenti/lib/strip";
import type { Widen } from "@quenti/lib/widen";
import { Prisma, type PrismaClient } from "@quenti/prisma/client";

import { TRPCError } from "@trpc/server";

import {
  getClassMember,
  getClassOrganizationMember,
} from "../../lib/queries/classes";
import type { NonNullableUserContext } from "../../lib/types";
import type { TGetSchema } from "./get.schema";

type GetOptions = {
  ctx: NonNullableUserContext;
  input: TGetSchema;
};

const orgSelect = Prisma.validator<Prisma.OrganizationDefaultArgs>()({
  select: {
    id: true,
    domains: {
      select: {
        id: true,
        domain: true,
        type: true,
      },
    },
  },
});

const studySetsSelect = Prisma.validator<Prisma.Class$studySetsArgs>()({
  select: {
    studySet: {
      select: {
        id: true,
        title: true,
        type: true,
        visibility: true,
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            terms: {
              where: {
                ephemeral: false,
              },
            },
            collaborators: true,
          },
        },
        collaborators: {
          take: 5,
          select: {
            user: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    },
  },
});

const foldersSelect = Prisma.validator<Prisma.Class$foldersArgs>()({
  select: {
    folder: {
      select: {
        id: true,
        title: true,
        slug: true,
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            studySets: true,
          },
        },
      },
    },
  },
});

const sectionsSelect = Prisma.validator<Prisma.Class$sectionsArgs>()({
  select: {
    id: true,
    name: true,
    joinCode: {
      select: {
        code: true,
      },
    },
    _count: {
      select: {
        students: {
          where: {
            deletedAt: null,
          },
        },
      },
    },
  },
});

const membersSelect = Prisma.validator<Prisma.Class$membersArgs>()({
  where: {
    type: "Teacher",
    deletedAt: null,
  },
  select: {
    id: true,
    user: {
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
      },
    },
  },
});

const teacherInvitesSelect = Prisma.validator<Prisma.Class$invitesArgs>()({
  where: {
    type: "Teacher",
  },
  select: {
    id: true,
    email: true,
    user: {
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
      },
    },
  },
});

const getTeacher = async (id: string, prisma: PrismaClient) => {
  return await prisma.class.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      logoUrl: true,
      logoHash: true,
      bannerColor: true,
      bannerUrl: true,
      bannerHash: true,
      cortexCategory: true,
      cortexCourse: true,
      organization: orgSelect,
      studySets: studySetsSelect,
      folders: foldersSelect,
      sections: sectionsSelect,
      members: membersSelect,
      invites: teacherInvitesSelect,
      _count: {
        select: {
          members: {
            where: {
              type: "Student",
              deletedAt: null,
            },
          },
        },
      },
    },
  });
};

const getStudent = async (id: string, prisma: PrismaClient) => {
  return await prisma.class.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      logoUrl: true,
      logoHash: true,
      bannerColor: true,
      bannerUrl: true,
      bannerHash: true,
      cortexCategory: true,
      cortexCourse: true,
      studySets: studySetsSelect,
      folders: foldersSelect,
    },
  });
};

type AwaitedGetTeacher = Awaited<ReturnType<typeof getTeacher>>;
type AwaitedGetStudent = Awaited<ReturnType<typeof getStudent>>;
type Widened = Widen<AwaitedGetTeacher | AwaitedGetStudent>;

export const getHandler = async ({ ctx, input }: GetOptions) => {
  const member = await getClassMember(input.id, ctx.session.user.id);
  let orgMember: Awaited<ReturnType<typeof getClassOrganizationMember>> = null;
  if (!member) {
    orgMember = await getClassOrganizationMember(input.id, ctx.session.user.id);
    if (!orgMember) throw new TRPCError({ code: "NOT_FOUND" });
  }

  if (member) {
    await ctx.prisma
      .$executeRaw`UPDATE ClassMembership SET viewedAt = NOW() WHERE id = ${member.id};`;
  }

  const class_ = (
    member?.type === "Teacher" ||
    ["Admin", "Owner"].includes(orgMember?.role || "")
      ? await getTeacher(input.id, ctx.prisma)
      : await getStudent(input.id, ctx.prisma)
  ) as Widened;

  return {
    id: class_.id,
    name: class_.name,
    description: class_.description,
    logoUrl: class_.logoUrl,
    logoHash: class_.logoHash,
    bannerColor: class_.bannerColor,
    bannerUrl: class_.bannerUrl,
    bannerHash: class_.bannerHash,
    cortexCategory: class_.cortexCategory,
    cortexCourse: class_.cortexCourse,
    studySets: class_.studySets.map((set) => ({
      ...set.studySet,
      collaborators: {
        total: set.studySet._count.collaborators,
        avatars: set.studySet.collaborators.map((c) => c.user.image || ""),
      },
    })),
    folders: class_.folders.map((f) => f.folder),
    ...strip({
      organization: class_.organization,
      teachers: class_.members,
      students: class_._count?.members,
      sections: class_.sections?.map((s) => ({
        id: s.id,
        name: s.name,
        students: s._count.students,
        joinCode: s.joinCode,
      })),
      teacherInvites: class_.invites,
    }),
    me: {
      id: member?.id || orgMember?.id,
      type:
        member?.type || (orgMember?.role == "Member" ? "Student" : "Teacher"),
      sectionId: member?.sectionId,
      preferences: member?.preferences,
    },
  };
};

export default getHandler;
