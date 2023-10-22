import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

import { USERNAME_REGEXP } from "@quenti/lib/constants/characters";

const NUM_STUDENTS = 10000;
const prisma = new PrismaClient();

const main = async () => {
  const users: {
    username: string;
    name: string;
    email: string;
    image: string;
    organizationId?: string;
  }[] = [];

  for (let i = 0; i < NUM_STUDENTS; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const image = faker.image.avatar();

    let username = "";
    while (!username.length || !USERNAME_REGEXP.test(username)) {
      username =
        faker.internet
          .userName({
            firstName: name.split(" ")[0],
            lastName: name.split(" ")[1],
          })
          .replace(".", "") + i.toString();
    }

    users.push({
      name,
      username,
      email: email.replace("@", `+${i}@`),
      image,
    });
  }

  if (process.env.TARGET_ORGANIZATION_ID) {
    const id = process.env.TARGET_ORGANIZATION_ID!;
    const org = await prisma.organization.findUnique({
      where: {
        id,
      },
    });

    if (!org) {
      console.error(`No organization with id '${id}' not found`);
      process.exit(1);
    }

    users.forEach((user) => {
      user.organizationId = org.id;
    });
  }

  const chunkSize = 1000;
  const chunks: (typeof users)[] = [];
  for (let i = 0; i < users.length; i += chunkSize) {
    const chunk = users.slice(i, i + chunkSize);
    chunks.push(chunk);
  }

  for (const chunk of chunks) {
    console.log(`Inserting chunk with ${chunk.length} users...`);
    await prisma.user.createMany({
      data: chunk.map((u) => ({ ...u, changelogVersion: "" })),
    });
  }

  console.log(`Created ${NUM_STUDENTS} users`);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
