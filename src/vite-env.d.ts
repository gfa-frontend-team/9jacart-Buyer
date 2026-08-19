/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_URL?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_API_BASIC_USERNAME?: string;
  readonly VITE_API_BASIC_PASSWORD?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_GOOGLE_ACCESS_TOKEN?: string;
  readonly VITE_NEOCASH_PUBLIC_KEY?: string;
  readonly VITE_NEOCASH_PUBLIC_KEY_TEST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
