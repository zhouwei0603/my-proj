import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import ElementPlus from "unplugin-element-plus/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig, loadEnv } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig((params) => {
  const cwd = process.cwd();
  const env = loadEnv(params.mode, cwd, '');

  console.log(`Vite started`);
  console.log(`Current Working Directory: ${cwd}`);
  console.log(`Parameters:\n${JSON.stringify(params, undefined, 2)}`);
  console.log(`Enviroment:\n${JSON.stringify(env, undefined, 2)}`);

  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      ElementPlus({
        useSource: true,
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      port: parseInt(env.NODE_PROD_PORT),
    },
    preview: {
      port: parseInt(env.NODE_DEV_PORT),
    },
  };
});
