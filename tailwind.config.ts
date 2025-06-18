import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sSky: '#C3EBFA',
        sSkyLight: '#EDF9FD',
        sPurpleLight: '#F1F0FF',
        sPurple: '#CFCEFF',
        sYellow: '#FAE27C',
        sYellowLight: '#FEFCE8'

      },
    },
  },
  plugins: [],
} satisfies Config;

