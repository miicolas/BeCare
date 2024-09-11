
import prisma from "@/lib/prisma"; // Assurez-vous que le chemin est correct pour votre projet
import {jwtDecode} from "jwt-decode";

export default async function handler(req: Request, res: Response) {
  if (req.method === "POST") {
    const { identityToken } = req.body;

    if (!identityToken) {
      return res.status(400).json({ error: "Identity token is required" });
    }

    try {
      const decodedToken = jwtDecode<any>(identityToken);
      const sub = decodedToken.sub;

      let user = await prisma.user.findUnique({
        where: { appleId: sub },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            appleId: sub,
            email: decodedToken.email,
            token: identityToken,
            provider: "apple",
          },
        });
      }

      return res.status(200).json({ user });

    } catch (error) {
      console.error("Error authenticating user:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}