# Godel Carpooling Demo

This is a sample project created to showcase Godel, the Optimization as a Service platform. Here a carpooling app generates data through this Polymer based web app. This data is then sent to our backend which then solves said problem and returns the optimal solution.

Check out the live demo here:
[Godel Carpooling Demo](http://demo.godel.io)

## Polymer:
[Polymer docs](https://www.polymer-project.org/1.0/) can be found here.

## Based on Polymer Starter Kit
[Polmer Starter Kit](https://github.com/polymerelements/polymer-starter-kit/releases/latest) can be found here.

### Install dependencies

```sh
npm install -g gulp bower && npm install && bower install
```

### Development workflow

#### Serve / watch
To run app locally:
```sh
gulp serve
```

#### Build & Vulcanize
To prepare app for deployment:
```sh
gulp
```
This will build and optimize the current project. This includes linting as well as vulcanization, image, script, stylesheet and HTML optimization and minification.
