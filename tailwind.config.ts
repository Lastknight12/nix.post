import { nextui } from "@nextui-org/theme";
import { type Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.tsx",
    "./node_modules/@nextui-org/theme/dist/components/(avatar|button|card|input|modal|navbar|popover|skeleton|spinner|user|ripple).js",
  ],
  theme: {
    extend: {
      fontFamily: {
        openSans: ["var(--font-open-sans)"],
        montserrat: ["var(--font-montserrat)"],
        comfortaa: ["var(--font-comfortaa)"],
      },
      textColor: {
        defaultDark: "#ececec",
        defaultLight: "#262626",
      },
      backgroundColor: {
        darkButton: "#353535",
        lightButton: "#848484",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
