deploy:
	ssh infomaniaknode 'cd ~/sites/randos.blizzardaudioclub.ch && git stash && git pull origin master && npm i && npm run build'