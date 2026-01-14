export function isImgbbUrl(url = "") {
  try {
    const u = new URL(url);
    // allow i.ibb.co or i.ibb.co.com (some people type this mistakenly)
    return (
      u.hostname === "i.ibb.co" ||
      u.hostname.endsWith(".ibb.co") ||
      u.hostname.includes("i.ibb.co")
    );
  } catch {
    return false;
  }
}
