import type { User } from "@quenti/prisma/client";

export const avatarUrl = (user: Pick<User, "username" | "image">): string =>
  user.username === "Quizlet" ? "/avatars/quenti.png" : user.image!;
