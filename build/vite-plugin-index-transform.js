import { isProdEnv } from "./utils/common";

/**
 * @type {import('vite').PluginOption}
 */
const demoIndexTransformPlugin = {
  name: "demo-transform",
  enforce: "pre",
  transform(code, path) {
    if (path.endsWith(".html")) return { code: transformIndexHtml(code), map: null };
  },
  transformIndexHtml,
};

function transformIndexHtml(code) {
  return code.replace(/__INDEX__/, isProdEnv() ? "/demo/index.prod.js" : "/demo/index.dev.js");
}


export default demoIndexTransformPlugin;
