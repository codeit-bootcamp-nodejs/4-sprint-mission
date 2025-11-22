echo '#!/bin/bash' > infra/ec2/start.sh
echo 'pm2 start ecosystem.config.cjs --env production' >> infra/ec2/start.sh
echo 'pm2 save' >> infra/ec2/start.sh