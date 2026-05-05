import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const JWT_SECRET = "supersecretkey";

export async function getCurrentUser() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (!decoded) return null;

    // Fetch the latest user data from the database to ensure permissions are up to date
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId || decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
      }
    });

    if (!user) return null;

    return {
      ...user,
      userId: user.id
    };
  } catch (error) {
    return null;
  }
}
