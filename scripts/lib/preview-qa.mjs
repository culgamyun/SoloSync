export function parsePreviewQaArgs(argv) {
  let url = null;
  let project = 'chromium';
  let headed = false;
  let bypass = true;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--headed') {
      headed = true;
      continue;
    }

    if (arg === '--no-bypass') {
      bypass = false;
      continue;
    }

    if (arg === '--url') {
      url = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (arg.startsWith('--url=')) {
      url = arg.slice('--url='.length);
      continue;
    }

    if (arg === '--project') {
      project = argv[index + 1] ?? project;
      index += 1;
      continue;
    }

    if (arg.startsWith('--project=')) {
      project = arg.slice('--project='.length);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!url) {
    throw new Error('Missing required --url value');
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error('Invalid preview URL');
  }

  if (!['chromium', 'mobile-chrome', 'all'].includes(project)) {
    throw new Error('Invalid --project value');
  }

  return {
    url: parsedUrl.toString().replace(/\/$/, ''),
    project,
    headed,
    bypass
  };
}
