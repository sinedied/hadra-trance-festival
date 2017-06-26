#!/bin/bash

set -e

export CWD=`pwd`
export SCRIPT_FOLDER=`dirname "${BASH_SOURCE[0]}"`
export APK_FOLDER=$CWD/platforms/android/build/outputs/apk
export DIST_FOLDER=$CWD/dist

function cleanup() {
    cd $CWD
    rm -rf $DIST_FOLDER
}

# Cleanup test folder in case of error
trap cleanup ERR

# Build demo
gulp clean:build
gulp build:demo

# Build android app and copy APKs
# gulp build:android
# cp $APK_FOLDER/android-*-debug.apk $DIST_FOLDER

cd $DIST_FOLDER

# Push branch with fresh start
git init
git remote add origin https://github.com/sinedied/hadra-trance-festival.git
git checkout --orphan gh-pages
git add .
git commit -m 'Initial commit'
git push -u origin gh-pages --force

echo "Online demo and Android test APKs deployed successfully"
