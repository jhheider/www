#!/bin/bash
# cmd: $ ./build-package-pages.sh srcJson targetPath
# sample:  $ .github/build-package-pages.sh src/data/packages.json src/content/packages'

for row in $(cat $1 | jq -r '.[] | @base64'); do
    _jq() {
     echo ${row} | base64 --decode | jq -r ${1}
    }
   touch $2/$(_jq '.slug').md
   content="---
type: page
title: \"$(_jq '.name')\"
Description: \"$(_jq '.desc' | tr '\"' "'")\"
layout: \"package-detail\"
---"
   echo "$content" > $2/$(_jq '.slug').md
done