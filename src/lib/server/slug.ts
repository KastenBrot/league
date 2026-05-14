const SLUG_MAX_LENGTH = 60;

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/-+$/g, '');
}

export function isValidSlug(slug: string): boolean {
  if (!slug || slug.length > SLUG_MAX_LENGTH) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
