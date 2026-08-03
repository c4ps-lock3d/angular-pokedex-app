deploy:
	ssh infomaniaknode 'cd ~/sites/pokedex.blizzardaudioclub.ch && git fetch origin master && git checkout master && git reset --hard origin/master && git clean -fd && npm i && npm run build'