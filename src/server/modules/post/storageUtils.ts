export const extractKeyFromMetadataUrl = (metadataUrl: string) => {
  try {
    const parsed = new URL(metadataUrl);
    const key = decodeURIComponent(parsed.pathname.replace(/^\/+/u, ""));
    return key.length > 0 ? key : null;
  } catch {
    return null;
  }
};
