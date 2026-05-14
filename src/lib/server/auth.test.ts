import { describe, expect, it, vi } from 'vitest';
import { signSession, verifySession } from './auth';

describe('session signing', () => {
  it('round-trips payloads with a valid signature', () => {
    vi.stubEnv('SESSION_SECRET', '0123456789abcdef0123456789abcdef');
    const payload = { userId: 123, username: 'alice' };

    const token = signSession(payload);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(2);

    expect(verifySession(token)).toEqual(payload);
  });

  it('rejects tampered tokens', () => {
    vi.stubEnv('SESSION_SECRET', '0123456789abcdef0123456789abcdef');
    const token = signSession({ userId: 1 });

    const [body, sig] = token.split('.');
    const tampered = `${body}a.${sig}`;
    expect(verifySession(tampered)).toBeNull();
  });

  it('rejects malformed tokens', () => {
    vi.stubEnv('SESSION_SECRET', '0123456789abcdef0123456789abcdef');
    expect(verifySession('no-dot')).toBeNull();
  });
});
