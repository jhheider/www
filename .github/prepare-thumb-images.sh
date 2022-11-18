#!/bin/bash
# cmd: $ ./prepare-thumb-images.sh srcJson targetPath
# sample:  $ .github/prepare-thumb-images.sh src/data/packages.json src/static/Images/packages/

# create packages folder: where airtable images will be DLd
mkdir -p ./packages_thumbs_images
packages="cat $1"
temp_packages="./src/data/temp.json"
cp $1 $temp_packages
for row in $($packages | jq -r '.[] | @base64'); do
    _jq() {
      echo ${row} | base64 --decode | jq -r ${1}
    }

    dl_url=$(_jq '.thumb_image_url')
    if [[ $dl_url == *"airtable"* ]]; then
        filename=$(basename -- "$dl_url")
        extension="${filename##*.}"
        filename="${filename%.*}"
        slug=$(_jq '.slug')
        outputPath=$2/$(_jq '.slug').$extension
        new_thumb_image_url="https://tea.xyz/Images/packages/$slug.jpg"
        curl $dl_url -o ./packages_thumbs_images/$slug.jpg
        updated_packages=$(jq '(.[] | select(.slug == "'$slug'") | .thumb_image_url) |= "'$new_thumb_image_url'"' ./src/data/temp.json)
        echo $updated_packages > $temp_packages
        echo "update $slug"
    fi
done

# replace packages.json with the updated version with localized image links
mv $temp_packages $1