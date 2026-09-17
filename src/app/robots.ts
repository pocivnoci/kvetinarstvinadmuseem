import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * robots.txt — vědomě VÍTÁME AI crawlery (mnoho webů je blokuje; my chceme
 * být v odpovědích ChatGPT, Perplexity, Google AI atd. vidět a citovaní).
 */
export default function robots(): MetadataRoute.Robots {
  const aiBots = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    "Amazonbot",
    "Bytespider",
    "CCBot",
    "Meta-ExternalAgent",
    "cohere-ai",
  ];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: aiBots, allow: "/", disallow: ["/admin", "/api"] },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
