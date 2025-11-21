#!/bin/bash
pm2 flush

pm2 start infra/ec2/ecosystem.config.cjs
