# list available jobs
default:
  just --list

# runs `hugo serve` locally
serve:
  hugo serve --watch --buildDrafts --source src

# makes the package pages
package-pages:
  .github/build-package-pages.sh src/data/packages.json src/content

# builds the site for ci
ci:
  -test -d node_modules && rm -rf node_modules
  npm ci
  hugo --source src --destination ../public --minify

# builds the site
build:
  npm i
  hugo --source src --destination ../public --minify

# cleans up build artifacts
clean:
  rm -rf public