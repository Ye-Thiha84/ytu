import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

export default defineConfig({
  viewTransitions: true, // ✅ Move it here, not inside vite

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [icon()],
});
