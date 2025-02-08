build:
	npm run build

zip:
	zip -r build.zip build

clean:
	rm -rf build

deploy:clean build zip
