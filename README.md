[![license](https://img.shields.io/github/license/TobitSoftware/chayns-js.svg)]() [![GitHub pull requests](https://img.shields.io/github/issues-pr/TobitSoftware/chayns-js.svg)]() [![](https://img.shields.io/github/issues-pr-closed-raw/TobitSoftware/chayns-js.svg)]()

# chayns® JavaScript API

In this section you will find general information about the chayns® JavaScript API. For more detailed information take a look at the [Wiki](https://github.com/TobitSoftware/chayns-js/wiki).

## Getting started

### Usage

If you want to use the chayns® JavaScript API in your own tapp, we suggest using the code below.

```HTML
<!-- To get started, load the chayns API styles and JavaScript from the CDN -->

<!-- css styles -->
<script src="https://api.chayns-static.space/css/v4/compatibility/compatibility.min.js" version="4.2"></script>

<!-- js api -->
<script src="https://api.chayns-static.space/js/v4.0/chayns.min.js"></script>
```

Once the chayns API is implemented, you only need to run the chayns.ready-Promise. <br>
Watch [this](https://github.com/TobitSoftware/chayns-js/wiki/Getting-Started) getting started tutorial for more information on chayns.ready.

### Debugging

To work on the chayns JavaScript API, you need to install the dependencies:

``
npm i
``

Once the dependencies have been installed successfully, you can add your ssl certificate files in webpack/ssl.
If you don't have one, you need to remove the props `https`, `cert` and `key` from your dev config. 
To use chayns with a non-https tapp, you have to add the url parameter `nrd=1`.

Then, you can start the webpack-dev-server:

``
npm start
``

The dev page will be available at port 8080.
