import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://xinteck.co.ke";

  // Static routes with SEO priority
  const routes = [
    { path: "", priority: 1.0, changeFreq: "weekly" as const },
    { path: "/about", priority: 0.9, changeFreq: "monthly" as const },
    { path: "/services", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/portfolio", priority: 0.8, changeFreq: "weekly" as const },
    { path: "/blog", priority: 0.8, changeFreq: "daily" as const },
    { path: "/careers", priority: 0.7, changeFreq: "weekly" as const },
    { path: "/contact", priority: 0.8, changeFreq: "monthly" as const },
    { path: "/privacy", priority: 0.3, changeFreq: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFreq: "yearly" as const },
    { path: "/cookies", priority: 0.3, changeFreq: "yearly" as const },
  ].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }));

  // Service pages
  const serviceRoutes = [
    "web-development",
    "mobile-app-development",
    "custom-software-development",
    "ui-ux-design",
    "cloud-devops",
  ].map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...routes, ...serviceRoutes];
}
