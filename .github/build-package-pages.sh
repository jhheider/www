#!/bin/bash
# cmd: $ ./build-package-pages.sh srcJson targetPath
# sample:  $ .github/build-package-pages.sh src/data/packages.json src/content/'

for row in $(jq -r '.[] | @base64' < "$1"); do
    _jq() {
     echo "${row}" | base64 --decode | jq -r "${1}"
    }
   full_name=$(_jq '.full_name')

   if [[ "$full_name" == *\/* ]] || [[ "$full_name" == *\\* ]]
   then
      mkdir -p "$2/+$full_name"
      rm -rf "$2/+$full_name"
   fi
   touch "$2"/"+$(_jq '.full_name')".md
   content="---
type: page
title: \"$(_jq '.name')\"
maintainer: \"$(_jq '.maintainer')\"
Description: \"$(_jq '.desc' | tr '\"' "'")\"
layout: \"package-detail\"
---"
   echo "$content" > "$2"/"+$(_jq '.full_name')".md
done