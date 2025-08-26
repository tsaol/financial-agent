import { NextRequest } from "next/server";

const BACKEND_URL = `${process.env.BACKEND_URL || 'http://localhost:8000'}/api/mcp-servers`;

export async function GET(req: NextRequest) {
  try {
    console.log("MCP Servers API: GET request received");
    
    const response = await fetch(BACKEND_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`MCP Servers API: Backend error! status: ${response.status}`);
      throw new Error(`Backend API error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("MCP Servers API: Successfully fetched servers", data.length, "servers");
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.error("MCP Servers API: Error in GET handler:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch MCP servers",
        details: error.message 
      }),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("MCP Servers API: POST request received");
    const body = await req.json();
    
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(`MCP Servers API: Backend error! status: ${response.status}`);
      throw new Error(`Backend API error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("MCP Servers API: Successfully updated servers");
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.error("MCP Servers API: Error in POST handler:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to update MCP servers",
        details: error.message 
      }),
      { status: 500 }
    );
  }
}