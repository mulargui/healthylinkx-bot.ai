sudo docker stop BOT.AI
sudo docker rm BOT.AI
sudo docker run -ti --name BOT.AI -p 80:80 -v /vagrant/apps/healthylinkx-bot.ai:/myapp --link NODEJSAPI:NODEJSAPI bot.ai /bin/bash