#!/bin/bash

set -e

export CWD=`pwd`
export SCRIPT_FOLDER=`dirname "${BASH_SOURCE[0]}"`
export DATA_FOLDER=$CWD/data
export OUT_DIR=$DATA_FOLDER/out
export NEW_IMAGES_FOLDER=$OUT_DIR/artists
export FIXED_IMAGES_FOLDER=$DATA_FOLDER/fixes/artists
export NEW_DATA_FILE=$OUT_DIR/festival.data

export SRC_FOLDER=$CWD/sources
export TARGET_DATA_FILE=$SRC_FOLDER/static/data.json
export TARGET_IMAGES_FOLDER=$SRC_FOLDER/images/

cd $DATA_FOLDER
rm -rf $OUT_DIR

# curl http://htf.yohann-bianchi.ovh/festivals -o festival.json

./extract-data.js festival.json $TARGET_DATA_FILE

cp -Rf $NEW_IMAGES_FOLDER $TARGET_IMAGES_FOLDER
cp -Rf $FIXED_IMAGES_FOLDER $TARGET_IMAGES_FOLDER

echo
echo "Updated data successfully!"
