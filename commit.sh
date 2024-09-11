#!/bin/bash
rm -rf publish
hexo g
git add .
git commit -m "更新文档"
git push