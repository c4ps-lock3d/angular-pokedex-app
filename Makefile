deploy:
	ssh infomaniaknode 'cd ~/sites/randos.blizzardaudioclub.ch && git stash && git pull origin master && npm i --legacy-peer-deps && npm run build'