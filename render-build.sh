#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run prisma:deploy
npm run prisma:seed