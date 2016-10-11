rm -rf dist
cp -r src dist
find dist/ -name *.js -type f -exec cp {} {}.flow \;
babel src/ -d dist/ "$@" --source-maps
