#!/usr/bin/env bash

git pull

yarn install

npx next build

touch tmp/restart.txt
