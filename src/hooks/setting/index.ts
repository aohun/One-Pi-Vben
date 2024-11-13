import type { GlobConfig } from '#/config';

import { getAppEnvConfig } from '@/utils/env';

export const useGlobSetting = (): Readonly<GlobConfig> => {
  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_ENABLE_ENCRYPT,
    VITE_GLOB_RSA_PUBLIC_KEY,
    VITE_GLOB_RSA_PRIVATE_KEY,
    VITE_GLOB_APP_CLIENT_ID,
    VITE_GLOB_WEBSOCKET_ENABLE,
  } = getAppEnvConfig();

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_TITLE.replace(/\s/g, '_').replace(/-/g, '_'),
    enableEncrypt: VITE_GLOB_ENABLE_ENCRYPT === 'true',
    // RSA公钥
    rsaPublicKey: VITE_GLOB_RSA_PUBLIC_KEY,
    // RSA私钥
    rsaPrivateKey: VITE_GLOB_RSA_PRIVATE_KEY,
    // 客户端key
    clientId: VITE_GLOB_APP_CLIENT_ID,
    // 是否开启websocket
    websocketEnable: VITE_GLOB_WEBSOCKET_ENABLE === 'true',
  };
  return glob as Readonly<GlobConfig>;
};
