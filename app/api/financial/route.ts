import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Financial API received direct request - should be avoided");

    const body = await req.json();
    
    const routerResponse = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/router`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!routerResponse.ok) {
      console.error(`Financial API: Router backend error! status: ${routerResponse.status}`);
      throw new Error(`Router backend API error! status: ${routerResponse.status}`);
    }
    
    const responseData = await routerResponse.json();
    console.log("Financial API: Got response from backend router", responseData?.input?.answering_tool);
    
    return new Response(JSON.stringify(responseData), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.error("Financial API: Error in POST handler:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while processing the request" }),
      { status: 500 }
    );
  }
}
