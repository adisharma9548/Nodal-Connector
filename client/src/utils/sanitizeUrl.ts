/**
 * Sanitizes user-supplied URLs to prevent DOM-based XSS attacks via javascript:, data:, or vbscript: schemes.
 * OWASP A03:2021 — Injection / Cross-Site Scripting (XSS) Mitigation.
 * Only allows safe protocols: https://, http://, and mailto:.
 */
export const sanitizeUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (trimmed === '' || trimmed === '#') return '#';

  // Relative URLs within the app are safe
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();
  // Strictly block dangerous pseudo-protocols
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return '#';
  }

  try {
    const parsed = new URL(trimmed);
    const safeProtocols = ['https:', 'http:', 'mailto:'];
    if (safeProtocols.includes(parsed.protocol.toLowerCase())) {
      return trimmed;
    }
    return '#';
  } catch {
    // If it looks like a clean domain name without protocol (e.g. "github.com/profile")
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return '#';
  }
};
