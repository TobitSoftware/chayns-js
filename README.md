# chayns® JavaScript API
In this section you will find general information about the chayns® JavaScript API. For more detailed information take a look at the [Wiki](https://github.com/TobitSoftware/chayns-js/wiki).

### Requirements
Node.js

## Getting started
To work on the chayns® JavaScript API it's necessary to install Node.js. You can find it [here](https://nodejs.org). For installing the dependencies you've got to open your Node.js terminal, change the path to your project's path and run:
```
npm i
```
Once the dependencies have been installed successfully, you can run the following gulp task to build a release version:
```
gulp deploy:release
```

***

If you want to use the chayns® JavaScript API in your own tapps, we suggest using the code below.

```HTML
<!-- To get started.. -->
<!-- Load the chayns API styles and JavaScript from the CDN -->

<!-- styles -->
<link rel="stylesheet" href="https://chayns-res.tobit.com/API/V3.1/css/chayns.min.css">

<!-- api -->
<script src="https://chayns-res.tobit.com/API/V3.1/js/chayns.min.js"></script>
```

Once the chayns® API is implemented, you only need to run the chayns.ready-Promise and are ready to use it. <br>
Watch [this](https://github.com/TobitSoftware/chayns-backend/wiki/Getting-Started) getting started tutorial for more information on chayns.ready.
