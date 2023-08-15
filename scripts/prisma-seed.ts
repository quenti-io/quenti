import { PrismaClient } from "@prisma/client";

import pjson from "../apps/next/package.json";

const prisma = new PrismaClient();

const version = pjson.version;

async function main() {
  await prisma.user.upsert({
    where: { email: "quenti@quenti.io" },
    update: {},
    create: {
      username: "Quizlet",
      name: "Quizlet",
      email: "quenti@quenti.io",
      changelogVersion: version,
      verified: true,
      studySets: {
        create: {
          title: "Local Development Overview",
          description: "Here are a few extra notes about Quenti.",
          visibility: "Public",
          terms: {
            createMany: {
              data: [
                {
                  rank: 0,
                  word: "Stack overview",
                  definition:
                    "Next.js /src directory app, Prisma, tRPC (/server), Chakra, Zustand",
                },
                {
                  rank: 1,
                  word: "DB models overview",
                  definition: `
- Study sets created by users contain terms
- Any user interacting with a study set creates a study set experience
- Study set experiences contain study data and studiable terms
- All study progress (learn, flashcards) are studiable terms which are PUT by the user
- Folders contain separate experiences for cards studying
- Each user has a SetAutoSave which is used to save draft sets as they are being created
                  `,
                },
                {
                  rank: 2,
                  word: "Project organization overview",
                  definition: `
- /adapters custom username Prisma adapter
- /common misc. shared items
- /components reusable shared components
- /constants common constants/numbers/regexes pertaining to app behavior
- /hooks custom hooks
- /icons SVG icons
- /interfaces type definitions that can't be inferred
- /lib common behavior and logic that isn't a util
- /modules large components for specific parts of the app
- /pages Next.js page directory
- /server tRPC server and routers
- /stores Zustand stores, logic for Learn and editor
- /utils utility functions
                  `,
                },
              ],
            },
          },
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
