import prisma from "@quenti/prisma";

import { clickhouse } from "./clickhouse";

const LAST_30_MINUTES = 1000 * 60 * 30;

type Activity = {
  organizationId: string;
  activeStudents: number;
  activeTeachers: number;
};

export const collectOrganizationActivity = async () => {
  const results = await prisma.user.groupBy({
    by: ["organizationId", "type"],
    where: {
      organizationId: {
        not: null,
      },
      lastSeenAt: {
        gte: new Date(Date.now() - LAST_30_MINUTES),
      },
    },
    _count: true,
  });

  let activity = results.reduce((acc, cur) => {
    const organizationId = cur.organizationId;
    const type = cur.type;
    const count = cur._count;

    const existing = acc.find((a) => a.organizationId === organizationId);

    if (existing) {
      const key = type == "Student" ? "activeStudents" : "activeTeachers";
      existing[key] = count as never;
    } else {
      acc.push({
        organizationId: organizationId!,
        activeStudents: type == "Student" ? count : 0,
        activeTeachers: type == "Teacher" ? count : 0,
      });
    }

    return acc;
  }, new Array<Activity>());

  const allOrganizations = await prisma.organization.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
    },
  });

  const missing = allOrganizations.filter(
    (org) => !activity.find((a) => a.organizationId === org.id),
  );
  activity = activity.concat(
    missing.map((org) => ({
      organizationId: org.id,
      activeStudents: 0,
      activeTeachers: 0,
    })),
  );

  await ingestIntoClickHouse(activity);
};

const ingestIntoClickHouse = async (activity: Activity[]) => {
  if (!clickhouse) return;

  await clickhouse.insert({
    table: "OrganizationActivity",
    values: activity,
    format: "JSONEachRow",
  });
};
