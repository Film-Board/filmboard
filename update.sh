#!/usr/bin/env bash

git pull

yarn install --prod

npx next build

touch tmp/restart.txt
