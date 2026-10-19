import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Helper function to read env keys from process.env or directly from .env file as runtime fallback
function getEnvVariable(key: string): string | undefined {
  if (process.env[key]) {
    return process.env[key];
  }
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      const match = content.match(new RegExp(`^${key}=["']?([^"'\r\n]+)["']?`, "m"));
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  } catch (e) {
    console.error("Error reading .env fallback:", e);
  }
  return undefined;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate inputs
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, message: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim() || `Direct Portfolio Message from ${name.trim()}`,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    // 1. Save message locally in data/contact_messages.json so no message is lost
    try {
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const logFile = path.join(dataDir, "contact_messages.json");
      let messages = [];
      if (fs.existsSync(logFile)) {
        try {
          const content = fs.readFileSync(logFile, "utf8");
          messages = JSON.parse(content);
        } catch {
          messages = [];
        }
      }
      messages.push(payload);
      fs.writeFileSync(logFile, JSON.stringify(messages, null, 2), "utf8");
    } catch (e) {
      console.error("Failed to store local message log:", e);
    }

    // 2. Resolve API keys using runtime fallback parser
    const web3Key =
      getEnvVariable("WEB3FORMS_ACCESS_KEY") ||
      getEnvVariable("NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY");
    const resendKey = getEnvVariable("RESEND_API_KEY");
    const formspreeUrl = getEnvVariable("FORMSPREE_URL");

    // Dispatch via Web3Forms if key exists
    if (web3Key && web3Key.trim()) {
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: web3Key.trim(),
            name: payload.name,
            email: payload.email,
            subject: payload.subject,
            message: payload.message,
            from_name: `${payload.name} (Portfolio Contact)`,
          }),
        });

        const result = await response.json();
        if (response.ok && result.success) {
          return NextResponse.json({
            success: true,
            message: "Your message has been delivered directly to Prateek's inbox!",
            data: payload,
          });
        } else {
          console.error("Web3Forms error response:", result);
          return NextResponse.json(
            {
              success: false,
              message: result.message || "Failed to dispatch email via Web3Forms.",
              fallbackMailto: true,
            },
            { status: 400 }
          );
        }
      } catch (e) {
        console.error("Web3Forms fetch error:", e);
      }
    }

    // Dispatch via Resend if key exists
    if (resendKey && resendKey.trim()) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey.trim()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: ["prateeksinghrajawat2006@gmail.com"],
            subject: payload.subject,
            reply_to: payload.email,
            html: `<p><strong>Name:</strong> ${payload.name}</p><p><strong>Email:</strong> ${payload.email}</p><p><strong>Message:</strong></p><p>${payload.message}</p>`,
          }),
        });

        if (response.ok) {
          return NextResponse.json({
            success: true,
            message: "Your message has been delivered directly to Prateek's inbox!",
            data: payload,
          });
        }
      } catch (e) {
        console.error("Resend fetch error:", e);
      }
    }

    // Dispatch via Formspree if URL exists
    if (formspreeUrl && formspreeUrl.trim()) {
      try {
        const response = await fetch(formspreeUrl.trim(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: payload.name,
            email: payload.email,
            subject: payload.subject,
            message: payload.message,
          }),
        });

        if (response.ok) {
          return NextResponse.json({
            success: true,
            message: "Your message has been delivered directly to Prateek's inbox!",
            data: payload,
          });
        }
      } catch (e) {
        console.error("Formspree fetch error:", e);
      }
    }

    // If no provider key is configured
    return NextResponse.json(
      {
        success: false,
        noKeyConfigured: true,
        message:
          "API key not set in .env. Please add WEB3FORMS_ACCESS_KEY in your .env file to enable instant inbox delivery.",
        fallbackMailto: true,
        data: payload,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error processing contact form submission:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while sending your message.",
      },
      { status: 500 }
    );
  }
}
