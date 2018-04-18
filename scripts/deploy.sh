# !/usr/bin/bash

set -e -x

yarn assets
gzip -S .cgz $(find public/assets -name '*.css')
gzip -S .jgz $(find public/assets -name '*.js')
bucket-assets --bucket artsy-force-$DEPLOY_ENV
heroku config:set ASSET_MANIFEST=$(cat manifest.json) --app=$HEROKU_APP
if [ -z "$CIRCLE_SHA1" ]; then
  git push --force git@heroku.com:$HEROKU_APP.git master
else
  git push --force git@heroku.com:$HEROKU_APP.git $CIRCLE_SHA1:refs/heads/master
fi
