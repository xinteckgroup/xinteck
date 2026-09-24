/**
 * Markdown utility functions for extracting and stripping images.
 *
 * Used by the portfolio detail page to separate gallery images from
 * the text content — images go into the ProjectGallery, text goes
 * into the ReactMarkdown renderer.
 */

/** Regex matching markdown image syntax: ![alt](url) */
const MD_IMAGE_RE = /!\[([^\]]*)\]\(([^)]+)\)/g;

/**
 * Extract all image URLs from markdown content, in order.
 */
export function extractImagesFromMarkdown(markdown: string): string[] {
  const urls: string[] = [];
  let match: RegExpExecArray | null;
  const re = new RegExp(MD_IMAGE_RE.source, MD_IMAGE_RE.flags);
  while ((match = re.exec(markdown)) !== null) {
    urls.push(match[2]);
  }
  return urls;
}

/**
 * Remove all markdown image lines from content.
 * Returns the text-only version for the ReactMarkdown renderer.
 */
export function stripImagesFromMarkdown(markdown: string): string {
  return markdown
    .replace(MD_IMAGE_RE, "")
    .replace(/\n{3,}/g, "\n\n") // collapse excess blank lines
    .trim();
}
