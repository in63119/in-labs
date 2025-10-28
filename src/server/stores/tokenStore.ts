import "server-only";

type Entry = { used: boolean; expiresAt: number };

declare global {
  // eslint-disable-next-line no-var
  var __inlabsTokenStore: Map<string, Entry> | undefined;
}

const store =
  globalThis.__inlabsTokenStore ?? (globalThis.__inlabsTokenStore = new Map());

export const tokenStore = {
  async store(jti: string, entry: Entry) {
    store.set(jti, entry);
  },

  async take(jti: string) {
    const entry = store.get(jti);
    if (!entry) {
      return null;
    }

    if (entry.expiresAt < Date.now()) {
      store.delete(jti);
      return null;
    }
    return entry;
  },

  async markUsed(jti: string) {
    const existing = store.get(jti);
    if (existing) {
      store.set(jti, { ...existing, used: true });
    }
  },

  async isAvailable(jti: string) {
    const entry = store.get(jti);
    if (!entry || entry.expiresAt < Date.now()) {
      store.delete(jti);
      return false;
    }
    return !entry.used;
  },
};
