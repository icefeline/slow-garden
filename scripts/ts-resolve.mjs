/**
 * Lets node's type-stripping run the app's own modules directly.
 *
 * The app's source imports extensionless ('../lib/types/tarot'), which is what
 * the bundler wants and what node's ESM resolver refuses. This hook retries a
 * failed relative resolve as '.ts', then as '/index.ts', so scripts can import
 * the real data files rather than keeping a second copy of them in sync.
 */
import { register } from 'node:module';

export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (err) {
    if (!specifier.startsWith('.')) throw err;
    for (const suffix of ['.ts', '/index.ts']) {
      try {
        return await next(specifier + suffix, context);
      } catch {
        // try the next shape
      }
    }
    throw err;
  }
}

register(import.meta.url, import.meta.url);
