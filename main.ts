// main.ts
export default {
  async fetch(req: Request): Promise<Response> {
    // So'rov URL-dan booking ID ni olish
    const url = new URL(req.url);
    const bookingId = url.searchParams.get("id");

    // Agar ID berilmagan bo'lsa, xato qaytarish
    if (!bookingId || typeof bookingId !== "string") {
      return new Response(
        JSON.stringify({ error: "Booking ID (id) talab qilinadi" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }

    // Tiket ID faqat harflar va raqamlardan iborat, 6 ta belgi (sizning misolingizda "QUAPWZ")
    if (!/^[A-Z0-9]{6}$/.test(bookingId)) {
      return new Response(
        JSON.stringify({ error: "Booking ID noto'g'ri formatda (6 ta katta harf/raqam)" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }

    try {
      // Tashqi API manzili
      const apiUrl = `https://railway.gov.tm/railway-api/bookings/${bookingId}`;

      // So'rov yuborish
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json, text/plain, */*",
          "X-Device-Id": "a77b5c929d9403811356e4dcf959973f",
        },
      });

      // Agar tashqi API xato qaytarsa
      if (!response.ok) {
        const errorText = await response.text();
        return new Response(
          JSON.stringify({
            error: `Railway API xatosi: ${response.status} ${response.statusText}`,
            details: errorText,
          }),
          {
            status: response.status,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      // Muvaffaqiyatli javob
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    } catch (error) {
      // Tarmoq yoki boshqa xatolik
      console.error("Server xatosi:", error);
      return new Response(
        JSON.stringify({
          error: "Serverda xatolik yuz berdi",
          message: error instanceof Error ? error.message : "Noma'lum xato",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  },
};
