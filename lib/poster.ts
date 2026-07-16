function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * amount));
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * amount));
  const b = Math.min(255, (num & 0xff) + Math.round(255 * amount));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function createPosterDataUri(title: string, baseColor: string): string {
  const lightColor = lighten(baseColor, 0.18);
  const fontSize = title.length > 14 ? 18 : 22;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${lightColor}" />
        <stop offset="1" stop-color="${baseColor}" />
      </linearGradient>
    </defs>
    <rect width="300" height="450" fill="url(#bg)" />
    <circle cx="240" cy="90" r="110" fill="#ffffff" opacity="0.06" />
    <circle cx="40" cy="380" r="140" fill="#000000" opacity="0.12" />
    <text x="150" y="405" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="700" fill="#ffffff">${escapeXml(title)}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
