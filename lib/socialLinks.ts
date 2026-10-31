export type Platform = "instagram" | "tiktok" | "youtube";

export const platformLabel: Record<Platform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
};

// Perfis oficiais: [a definir]. Os links levam à home de cada rede até haver os perfis.
export const socialLinks: { platform: Platform; label: string; href: string }[] = [
  { platform: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
  { platform: "tiktok", label: "TikTok", href: "https://www.tiktok.com/" },
  { platform: "youtube", label: "YouTube", href: "https://www.youtube.com/" },
];
