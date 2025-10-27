deploy:
	ssh infomaniaknode 'cd ~/sites/pokedex.blizzardaudioclub.ch && git pull origin master && npm run build'