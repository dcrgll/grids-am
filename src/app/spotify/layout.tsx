export const metadata = {
  description:
    "Generate a collage of your most listened to albums from Spotify.",
  title: "Grids // Spotify",
};

export default function SpotifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
