/**
 * Convert a string to a URL-friendly slug
 * Example: "The Shawshank Redemption" -> "the-shawshank-redemption"
 */
export const generateSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
};

/**
 * Extract ID from slug (assumes slug format: "title-123")
 */
export const extractIdFromSlug = (slug) => {
  if (!slug) return null;
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  // Check if last part is a number (the ID)
  if (/^\d+$/.test(lastPart)) {
    return parseInt(lastPart, 10);
  }
  return null;
};

/**
 * Create a full slug with ID
 * Example: "The Shawshank Redemption", 278 -> "the-shawshank-redemption-278"
 */
export const createFullSlug = (title, id) => {
  const titleSlug = generateSlug(title);
  return `${titleSlug}-${id}`;
};
