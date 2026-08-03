deploy:
	ssh infomaniaknode 'cd ~/sites/pokedex.blizzardaudioclub.ch && git pull origin master && npm i && npm run build'