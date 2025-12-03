#!/bin/bash
npm ci

npm run build

pm2 flush

pm2 start infra/ec2/ecosystem.config.cjs
