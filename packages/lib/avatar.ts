import type { User } from "@quenti/prisma/client";

/// Legacy
export const avatarUrl = (user: Pick<User, "username" | "image">): string =>
  user.image!;
