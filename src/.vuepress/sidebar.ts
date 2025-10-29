import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    "portfolio",
    {
      text: "java",
      prefix: "java/",
      link: "java/",
      collapsible: true,
      children: [
        {
          text:"构建",
          prefix: "build/",
          collapsible: true,
          children:[
            {
              text:"maven",
              prefix: "maven/",
              collapsible: true,
              children: "structure",
            }
          ]
        }
      ],
    },
    {
      text: "devops",
      prefix: "devops/",
      collapsible: true,
      link: "devops/",
      children: [
        {
          text:"docker",
          prefix: "docker/",
          collapsible: true,
          children: "structure",
        }
      ],
    },
    {
      text: "cxx",
      prefix: "cxx/",
      link: "cxx/",
      children: "structure",
    },
    {
      text: "器",
      prefix: "tool/",
      link: "tool/",
      children: "structure",
    },
    {
      text: "案例",
      icon: "laptop-code",
      prefix: "demo/",
      link: "demo/",
      children: "structure",
    },
    {
      text: "文档",
      icon: "book",
      prefix: "guide/",
      children: "structure",
    },
    {
      text: "幻灯片",
      icon: "person-chalkboard",
      link: "https://ecosystem.vuejs.press/zh/plugins/markdown/revealjs/demo.html",
    },
  ],
});
