import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helper";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isAdmin } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: { isAdmin },
    });

    return NextResponse.json({ 
      message: "Role updated successfully", 
      isAdmin: updatedUser.isAdmin 
    });
  } catch (error: any) {
    console.error("Role update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
