import chromium from "@sparticuz/chromium";
import type { Browser } from "puppeteer-core";

// Vercel/AWS Lambda can't run full puppeteer's bundled Chromium, so on
// serverless we drive a Lambda-compatible Chromium via puppeteer-core.
const isServerless =
  !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

async function launchBrowser(): Promise<Browser> {
  if (isServerless) {
    const puppeteer = (await import("puppeteer-core")).default;
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  // Local development: use the full puppeteer with its bundled Chromium.
  const puppeteer = (await import("puppeteer")).default;
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  return browser as unknown as Browser;
}

/**
 * Server-side PDF generation with Puppeteer.
 *
 * Rather than re-implementing the resume templates, we render the existing
 * preview page in a headless Chromium instance and print it to PDF. The page
 * is protected, so the caller forwards the authenticated session cookie.
 */
export async function generateResumePdf(
  targetUrl: string,
  cookieHeader?: string
): Promise<Buffer> {
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();

    if (cookieHeader) {
      await page.setExtraHTTPHeaders({ cookie: cookieHeader });
    }

    await page.goto(targetUrl, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
