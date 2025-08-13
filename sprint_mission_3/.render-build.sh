# .render-build.sh
set -euxo pipefail
npx prisma generate
npx prisma migrate deploy
npx prisma db seed