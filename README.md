# Hadra Trance Festival 2016

[![Build status](https://img.shields.io/travis/sinedied/hadra-trance-festival/master.svg)](https://travis-ci.org/sinedied/hadra-trance-festival)

See [Hadra website](http://www.hadra.net/index.php?goto=/festival.php) for more info about the festival.

Another awesome project scaffolded by the [angular-pro](https://github.com/angular-starter-kit/generator-angular-pro) Yeoman generator!

# Getting started

1. Install required tool `gulp` and `bower`:
 ```
 npm install -g gulp bower
 ```

2. Install project tools, go to project folder:
 ```
 npm install
 ```

 - To build the iOS version, you need to install [XCode](https://itunes.apple.com/app/xcode/id497799835)
 - To build the Android version, you need to install the
   [Android SDK](http://developer.android.com/sdk/installing/index.html)

3. Launch development server:
 ```
 gulp serve
 ```

4. Prepare Cordova platforms and plugins
 ```
 gulp cordova:prepare
 ```
 
5. Run on device
 ```
 gulp run:<ios|android> --device
 ```

# Project structure
```
gulp/                   individual gulp tasks
sources/                project source code
|- data/                other project data, will be copied as-is
|- fonts/               project fonts
|- images/              project images
|- libraries/           Bower dependencies
|- main/                app components
|  |- main.config.ts    app configuration code
|  |- main.constants.ts app configuration constants
|  |- main.module.ts    app module definition
|  |- main.routes.ts    app routes
|  |- main.run.ts       app entry point
|  |- main.wrappers.ts  AngularJS module wrappers for external libraries
|  |- main.scss         style entry point
|  |- helpers/          helper services
|  |- screens/          application screens
|  |- shell/            application shell
|  |- ui-components/    shared UI components
|  |- web-services/     web services
|  +- ...               additional components
|- translations/        translations files
+- index.html           html entry point
e2e/                    end-to-end tests
www/                    compiled version
typings/                TypeScript definitions
reports/                test and coverage reports
hooks/                  Cordova build hooks
platforms/              Cordova platform-specific projects
plugins/                Cordova plugins
resources/              icon and splash screen resources
gulpfile.config.js      gulp tasks configuration
```

# Main gulp tasks

Tasks       | Description
------------|-------------------------------------------------------------------------------
default     | run `clean`, then `build`
serve       | Launch a web server with live reload and API proxy, then open app in browser.
serve:dist  | Launch a web server using dist files.
build       | Build and optimize the current project, ready for deployment. This includes linting as well as image, script, stylesheet and HTML optimization and minification.
clean       | Delete temporary files and dist files.
test        | Launch unit tests using karma and jasmine.
test:auto   | Launch karma server and launch unit tests after each change in project files.
protractor  | Launch e2e tests using protractor.
tsd         | Download and update all TypeScript definitions for Bower dependencies.

When building the application, you can specify the target environment using the flag `--environment <name>`.

The default build environment is `production`. See [this documentation](docs/build-environments.md) for more details
about multiple build environments management.

# Coding guides

- [JavaScript](docs/coding-guides/javascript.md)
- [TypeScript](docs/coding-guides/typescript.md)
- [CSS](docs/coding-guides/css.md)
- [HTML](docs/coding-guides/html.md)
- [Unit tests](docs/coding-guides/unit-tests.md)
- [End-to-end tests](docs/coding-guides/e2e-tests.md)

# Additional documentation

- [Cordova](docs/cordova.md)
- [Build environments](docs/build-environments.md)
- [i18n](docs/i18n.md)
- [Proxy configuration](docs/proxy.md)
- [All gulp tasks](docs/tasks.md)
- [Updating dependencies](docs/updating.md)

# License

[GNU GPLv3](LICENSE)

```
Hadra Trance Festival - The Official Mobile Application
Copyright (C) 2016 Yohan Lasorsa (Hadra)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
```
