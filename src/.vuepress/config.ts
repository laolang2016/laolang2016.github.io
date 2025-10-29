import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "野鬼圣经",
  description: "潼关路上始终是黑暗的",

  pagePatterns: ["**/*.md", "!**/*.snippet.md", "!.vuepress", "!node_modules"],

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});

