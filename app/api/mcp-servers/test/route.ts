import { NextRequest } from "next/server";

const BACKEND_URL = `${process.env.BACKEND_URL || 'http://localhost:8000'}/api/mcp-servers/test`;

export async function POST(req: NextRequest) {
  try {
    console.log("MCP Servers Test API: POST request received");
    const body = await req.json();
    
    if (!body.hostname) {
      return new Response(
        JSON.stringify({ error: "Hostname is required" }),
        { status: 400 }
      );
    }
    
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(`MCP Servers Test API: Backend error! status: ${response.status}`);
      throw new Error(`Backend API error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("MCP Servers Test API: Connection test completed", data.success ? "SUCCESS" : "FAILED");
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.error("MCP Servers Test API: Error in POST handler:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Failed to test MCP server connection",
        details: error.message 
      }),
      { status: 500 }
    );
  }
}