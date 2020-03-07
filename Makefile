.DEFAULT_GOAL := parse

save:
	@node save_data.js

parse: save
	@node run.js > ./schema.json

clean:
	@rm *.html
