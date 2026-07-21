import type { Metadata } from "next";

const site = {
  description: "Generate album covers from your music library",
  title: "Grids",
  url: "https://grids.am",
};

export const meta = {
  description: site.description,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL(site.url),
  openGraph: {
    description: site.description,
    images: [
      {
        url: "/og-image.png",
      },
    ],
    siteName: site.title,
    title: site.title,
    url: site.url,
  },
  title: site.title,
  twitter: {
    card: "summary_large_image",
  },
} as Metadata;
