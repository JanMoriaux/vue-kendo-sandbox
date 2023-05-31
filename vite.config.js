import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
const path = require("path");

export default defineConfig(command => {
  const env = loadEnv(command.mode ?? "development", process.cwd(), "");

  return {
    base: env.VUE_APP_SITE_ROOT,
    envPrefix: "VUE_APP_",
    plugins: [vue()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },
    esbuild: {
      drop: ["debugger"],
      pure: [
        "console.log",
        "console.error",
        "console.warn",
        "console.debug",
        "console.trace",
        "console.dir"
      ]
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        plugins: [
          {
            name: "kendo:pdf:resolver",
            setup(build) {
              build.onResolve(
                {
                  filter: new RegExp(".+/kendo.pdf$")
                },
                async () => {
                  return {
                    path: path.resolve(
                      __dirname,
                      `node_modules/@progress/kendo-ui/js/kendo.pdf.js`
                    )
                  };
                }
              );
            }
          }
        ]
      }
    },
    server: {
      fs: {
        // Allow serving files from one level up to the project root
        allow: [".."]
      }
    }
  };
});
