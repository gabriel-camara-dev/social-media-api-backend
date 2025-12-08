#!/bin/bash

git pull origin dev

npm ci

npm run build

npx prisma migrate deploy

npx prisma db seed

pm2 reload ecosystem.config.js