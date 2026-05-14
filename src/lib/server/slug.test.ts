import { describe, expect, it } from 'vitest';
import { isValidSlug, slugify } from './slug';

describe('slugify', () => {
  it('lowercases and replaces whitespace with dashes', () => {
    expect(slugify('Spearhead Summer 26')).toBe('spearhead-summer-26');
  });

  it('strips combining accents', () => {
    expect(slugify('Café München')).toBe('cafe-munchen');
  });

  it('collapses consecutive separators', () => {
    expect(slugify('  hello   __ world!!  ')).toBe('hello-world');
  });

  it('trims leading and trailing dashes', () => {
    expect(slugify('---foo bar---')).toBe('foo-bar');
  });

  it('truncates without leaving a trailing dash', () => {
    const long = 'a'.repeat(58) + ' bbb';
    const out = slugify(long);
    expect(out.endsWith('-')).toBe(false);
    expect(out.length).toBeLessThanOrEqual(60);
  });

  it('returns an empty string for non-alphanumeric input', () => {
    expect(slugify('!!! @@@ ###')).toBe('');
  });
});

describe('isValidSlug', () => {
  it('accepts normal slugs', () => {
    expect(isValidSlug('spearhead-summer-26')).toBe(true);
    expect(isValidSlug('a1')).toBe(true);
  });

  it('rejects empty / leading or trailing dash / double dash / uppercase', () => {
    expect(isValidSlug('')).toBe(false);
    expect(isValidSlug('-foo')).toBe(false);
    expect(isValidSlug('foo-')).toBe(false);
    expect(isValidSlug('foo--bar')).toBe(false);
    expect(isValidSlug('Foo')).toBe(false);
  });

  it('rejects spaces and special characters', () => {
    expect(isValidSlug('foo bar')).toBe(false);
    expect(isValidSlug('foo/bar')).toBe(false);
    expect(isValidSlug('foo.bar')).toBe(false);
  });
});
