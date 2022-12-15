#!/bin/bash
# update packages.json data with relative thumb image url path
# rebuild pages
# download images from www.tea.xyz/Images/packages to 

# cmd: $ ./prepare-thumb-images.sh srcJson targetPath
# sample:  $ .github/prepare-thumb-images.sh src/data/packages.json src/static/Images/packages/

# create packages folder: where airtable images will be DLd
packages="cat $1"
temp_packages="./src/data/temp.json"
cp $1 $temp_packages
for row in $($packages | jq -r '.[] | @base64'); do
    _jq() {
      echo ${row} | base64 --decode | jq -r ${1}
    }
    dl_url=$(_jq '.thumb_image_url')
    if [[ $dl_url == *"tea.xyz"* ]]; then
        filename=$(basename -- "$dl_url")
        extension="${filename##*.}"
        filename="${filename%.*}"
        slug=$(_jq '.slug')

        new_thumb_image_url="/Images/packages/$filename.$extension"

        updated_packages=$(jq '(.[] | select(.slug == "'$slug'") | .thumb_image_url) |= "'$new_thumb_image_url'"' ./src/data/temp.json)
        echo $updated_packages > $temp_packages
        echo "update $slug"
    fi
done

# replace packages.json with the updated version with localized image links
mv $temp_packages $1