import { describe, expect, it } from 'vitest';

async function loadPreviewQaHelpers() {
  const modulePath = '../../scripts/lib/preview-qa.mjs';
  return import(modulePath);
}

describe('preview QA script helpers', () => {
  it('parses the required url plus optional project and headed flags', async () => {
    const { parsePreviewQaArgs } = await loadPreviewQaHelpers();

    expect(parsePreviewQaArgs(['--url', 'https://example.vercel.app', '--project', 'mobile-chrome', '--headed'])).toEqual({
      url: 'https://example.vercel.app',
      project: 'mobile-chrome',
      headed: true,
      bypass: true
    });
  });

  it('supports inline args and bypass disabling', async () => {
    const { parsePreviewQaArgs } = await loadPreviewQaHelpers();

    expect(parsePreviewQaArgs(['--url=https://example.vercel.app/', '--project=all', '--no-bypass'])).toEqual({
      url: 'https://example.vercel.app',
      project: 'all',
      headed: false,
      bypass: false
    });
  });

  it('falls back to npm config env vars when argv flags are swallowed by npm', async () => {
    const { parsePreviewQaArgs } = await loadPreviewQaHelpers();

    expect(
      parsePreviewQaArgs([], {
        npm_config_url: 'https://example.vercel.app/',
        npm_config_project: 'mobile-chrome',
        npm_config_headed: 'true',
        npm_config_no_bypass: 'true'
      })
    ).toEqual({
      url: 'https://example.vercel.app',
      project: 'mobile-chrome',
      headed: true,
      bypass: false
    });
  });

  it('prefers explicit argv values over npm config fallbacks', async () => {
    const { parsePreviewQaArgs } = await loadPreviewQaHelpers();

    expect(
      parsePreviewQaArgs(['--url', 'https://argv.vercel.app', '--project', 'all'], {
        npm_config_url: 'https://env.vercel.app',
        npm_config_project: 'mobile-chrome'
      })
    ).toEqual({
      url: 'https://argv.vercel.app',
      project: 'all',
      headed: false,
      bypass: true
    });
  });

  it('rejects missing url, invalid url, and invalid project values', async () => {
    const { parsePreviewQaArgs } = await loadPreviewQaHelpers();

    expect(() => parsePreviewQaArgs([])).toThrow('Missing required --url value');
    expect(() => parsePreviewQaArgs(['--url', 'not-a-url'])).toThrow('Invalid preview URL');
    expect(() => parsePreviewQaArgs(['--url', 'https://example.vercel.app', '--project', 'firefox'])).toThrow(
      'Invalid --project value'
    );
  });
});
