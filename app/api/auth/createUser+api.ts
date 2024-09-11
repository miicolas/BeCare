import prisma from "@/lib/prisma";

export async function POST(request: Request, response: Response) {
  const { appleId, token, email, provider } = await request.json();
  console.log("create user", appleId, token, email, provider);

  try {
    const checkUser = await prisma.user.findFirst({
      where: {
        appleId,
      },
    });
    console.log("check user", checkUser);

    if (!checkUser) {
      console.log("creating new user");
      const createUser = await prisma.user.create({
        data: {
          appleId,
          email,
          provider,
          token,
        },
      });
      console.log("create user", createUser);
      return new Response("User created", { status: 201 });
    }

    return new Response("User already exists", { status: 400 });
  } catch (error: any) {
    console.error("Error creating user:", error);  // Log the detailed error message
    return new Response(`Error creating user: ${error.message}`, { status: 500 });
  }
}
