/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPLINE_SCENE_URL?: string;
  readonly VITE_CHOICE_FORM_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
