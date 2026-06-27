import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

function exposeSupabaseEnvForStaticClient(): Plugin {
  return {
    name: "zero9home-expose-supabase-env-for-client",
    config(_, { mode }) {
      const env = loadEnv(mode, process.cwd(), "");
      const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
      const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY;

      return {
        define: {
          ...(supabaseUrl ? { "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl) } : {}),
          ...(supabaseKey ? { "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(supabaseKey) } : {}),
        },
      };
    },
  };
}

function appwriteStaticFallbackPlugin(): Plugin {
  return {
    name: "zero9home-appwrite-static-fallback",
    apply: "build",
    closeBundle() {
      const indexHtml = join(process.cwd(), "dist", "index.html");
      const notFoundHtml = join(process.cwd(), "dist", "404.html");

      // Appwrite Static Sites can use this as the SPA fallback file. A 404.html
      // copy also protects hosts that automatically fallback to /404.html.
      if (existsSync(indexHtml)) {
        copyFileSync(indexHtml, notFoundHtml);
      }
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tsconfigPaths(),
    tailwindcss(),
    exposeSupabaseEnvForStaticClient(),
    appwriteStaticFallbackPlugin(),
  ],
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode === "production" ? "production" : "development"),
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  preview: {
    host: "0.0.0.0",
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
}));
