// main.ts

export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const bookingId = url.searchParams.get("id");

    if (!bookingId) {
      return new Response(JSON.stringify({ error: "Booking ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const apiUrl = `https://railway.gov.tm/railway-api/bookings/${bookingId}`;
      const response = await fetch(apiUrl, {
        headers: {
          Accept: "application/json, text/plain, */*",
          "X-Device-Id": "a77b5c929d9403811356e4dcf959973f",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    } catch (error) {
      console.error("Error fetching railway API:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch booking data" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};
