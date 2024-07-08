const config = () => ({
  appEnv: import.meta.env.NODE_ENV || "local",
  baseURL: import.meta.env.VITE_SERVER_URL_LOCAL || "http://localhost:8000",
  timeout: 120000,
  gitTag: import.meta.env.VUE_APP_GIT_TAG_VERSION || "0.0.0",
});
export default config;
