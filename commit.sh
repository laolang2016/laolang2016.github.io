#!/bin/bash
rm -rf public
rm -rf src/.vuepress/dist
npm run docs:build
mv src/.vuepress/dist public
git add .
git commit -m "更新文档"
git push
