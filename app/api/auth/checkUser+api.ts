import prisma from "@/lib/prisma";

export async function POST(request: Request, response: Response) {
  const { appleId } = await request.json();

  try {
    const checkUser = await prisma.user.findFirst({
      where: {
        appleId,
      },
    });

    if (checkUser) {
      return Response.json({ checkUser, message: "User already exists" });
    } else {
      return Response.json({ checkUser, message: "User does not exist" });
    }
  } catch (error) {
    return Response.json({ error, message: "Error checking user" });
  }
}
