import terseCssr from "./utils/terse-cssr";

/** @type {import('vite').PluginOption} */
export default {
  name: "css-render-vite",
  transform(src, path) {
    if (path.endsWith(".cssr.ts") || path.endsWith(".cssr.js")) return terseCssr(src);
  },
};
