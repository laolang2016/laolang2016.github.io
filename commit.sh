#!/bin/bash
rm -rf public
rm -rf docs
hexo d
mv public docs
git add .
git status
git commit -m "📃 docs(guide): 更新文档"

