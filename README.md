# ts-webgl-template
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

The preinstalled environment with a lot of awesome things to start working with computer graphics in browser without headache about webpack and other configs.

### Installation
- `npm install`
- `npm init` (optional)

### Scripts
- `npm run start` for development
- `npm run build` for release build
- `npm run test` for unit tests
- `npm run lint:styles:fix` to fix linting in css
- More in [./package.json](./package.json#L6)

### Features:
- Configured [webpack.config.ts](./webpack.config.ts) with detailed comments
- - Using typescript for config
- - Configured source maps
- - Configured minificators for release build
- - Configured SASS
- - Configured GLSL shaders loader [webpack-glsl-minify](https://github.com/leosingleton/webpack-glsl-minify)
- Configured unit-test
- - Configured jest
- - Simple example unit-test ([example.test.ts](./test/example.test.ts))
- Configured vsconfig
- - Use propper linting
- - Launch script to run specific unit test file in debug mode
- - Launch browser attaching to VsCode for debugging right in the IDE
- Configured linting
- - Configured eslint to use [google typescript style guide](https://google.github.io/styleguide/tsguide.html)
- - Configured css/sass linting
- - Configured prettier
- Implemented a simple project
- - Simple fullscreen shader render loop
- - Use [twgl](https://github.com/greggman/twgl.js)
- - Use [tweakpane](https://github.com/cocopon/tweakpane)

### The simple project:
<p align="center">
<img align="center" alt="SimpleDemo" src="https://user-images.githubusercontent.com/3998597/134040595-4496a7d0-e50b-47cf-a09a-7cb2aed790cc.png">
<em>The simple shader equivalent to <a href="https://www.shadertoy.com/new">shadertoy template</a> with <a href="https://cocopon.github.io/tweakpane/">Tweakpane</a> tuner</em>
</p>

