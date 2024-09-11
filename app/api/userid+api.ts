export async function POST(request: Request) {
  
    const { userID } = await request.json();
    console.log("POST request", userID);

    return Response.json({ hello: 'world' });
  }