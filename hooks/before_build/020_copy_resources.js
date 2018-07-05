#!/usr/bin/env node

const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');

const rootdir = process.argv[2];
const isWin = /^win/.test(process.platform);
const inputPath = process.env.ANDROID_NATIVE_RESOURCES_PATH || path.normalize('native/android');
let androidResourcesPath = path.normalize('platforms/android/app/src/main/res');

if (!fs.existsSync(androidResourcesPath)) {
  // For cordova-android < 7 compatibility
  androidResourcesPath = path.normalize('platforms/android/res');
}

function copyAndroidResources() {
  const command = `${isWin ? 'xcopy /S /Y /I' : 'cp -Rfv'} "${inputPath + path.sep}." "${androidResourcesPath}"`;
  process.stdout.write(`Copying Android native resources with command: ${command}\n`);
  execSync(command, {stdio: 'inherit'});
}

if (rootdir) {
  copyAndroidResources();
}
