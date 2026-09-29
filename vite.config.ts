import { defineConfig, Plugin } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

function preserveUseClientDirective(): Plugin {
  return {
    name: "preserve-use-client",
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === "chunk" && chunk.moduleIds) {
          // Check if any of the original modules had "use client"
          for (const moduleId of chunk.moduleIds) {
            const moduleInfo = this.getModuleInfo(moduleId);
            if (moduleInfo?.code?.trimStart().startsWith('"use client"') ||
                moduleInfo?.code?.trimStart().startsWith("'use client'")) {
              chunk.code = '"use client";\n' + chunk.code;
              break;
            }
          }
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), preserveUseClientDirective()],
  // Set the JSX runtime here, not only in tsconfig: esbuild skips tsconfig for files under a
  // node_modules path, which is where git installs build this package (e.g. pnpm's store in CI).
  esbuild: { jsx: "automatic" },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "recharts"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
    cssCodeSplit: false,
  },
});
