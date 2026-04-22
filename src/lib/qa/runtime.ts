export type QaRuntimeEnv = {
  nodeEnv?: string;
  vercelEnv?: string;
};

export function isPreviewRuntime(env: QaRuntimeEnv) {
  return env.vercelEnv === 'preview';
}

export function isProductionRuntime(env: QaRuntimeEnv) {
  if (env.vercelEnv === 'production') {
    return true;
  }

  return env.nodeEnv === 'production' && !isPreviewRuntime(env);
}

export function isQaBypassAllowedRuntime(env: QaRuntimeEnv) {
  return !isProductionRuntime(env);
}
