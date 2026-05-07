import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const root = process.cwd();

function readSource(relativePath: string) {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('login OAuth source guards', () => {
  it('keeps public Supabase env access statically inlineable for the client bundle', () => {
    const source = readSource('src/lib/env.ts');

    expect(source).toContain('NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL');
    expect(source).toContain('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
    expect(source).not.toContain('publicSchema.parse(process.env)');
  });

  it('uses an explicit OAuth redirect URL instead of silent implicit browser navigation', () => {
    const source = readSource('src/components/common/oauth-buttons.tsx');

    expect(source).toContain('skipBrowserRedirect: true');
    expect(source).toContain('window.location.assign(data.url)');
    expect(source).toContain("role='alert'");
  });

  it('prevents awkward Korean word breaks in the login subtitle', () => {
    const source = readSource('src/app/[locale]/(auth)/login/page.tsx');

    expect(source).toContain('max-w-[21rem] break-keep');
  });
});
