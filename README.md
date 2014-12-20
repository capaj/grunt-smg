# grunt-smg
> Plugin for generating $script manifests

Deprecated. I have used this for loading my script files before I knew [jspm](http://jspm.io/)/[systemjs](https://github.com/systemjs/systemjs). So if you are considering using this, think again and try rather systemjs. I should probably delete this repo, but I will leave it just as a showcase of my misstep on searching for frontend JS dependency management.

Have you ever written script like this by hand?
```js
$script([
    "/js/routes.js",
    "/bower_components/jquery/jquery.js",
    "/bower_components/angular-latest/lib/jquery/jquery.js"
], "1");
$script.ready("1", function () {
    $script([
        "/bower_components/bootstrap/js/transition.js",
        "/bower_components/bootstrap/js/tooltip.js",
        "/bower_components/bootstrap/js/tab.js",
        "/bower_components/bootstrap/js/scrollspy.js",
        "/bower_components/bootstrap/js/popover.js",
        "/bower_components/bootstrap/js/modal.js",
        "/bower_components/bootstrap/js/dropdown.js",
        "/bower_components/bootstrap/js/collapse.js",
        "/bower_components/bootstrap/js/carousel.js",
        "/bower_components/bootstrap/js/button.js",
        "/bower_components/bootstrap/js/alert.js",
        "/bower_components/bootstrap/js/affix.js",
        "/js/angular/angular.min.js"
    ], "2");
});
$script.ready("2", function () {
    $script(["/js/services/github.js",
        "/js/controllers/repos-ctrl.js",
        "/js/controllers/pulls-ctrl.js",
        "/js/controllers/main-ctrl.js",
        "/js/controllers/log-in-ctrl.js",
        "/js/controllers/issues-ctrl.js",
        "/js/angular/angular-route.min.js",
        "/js/main-dev.js",
        "/js/app.js"
    ], "scriptManifestReady");
});
```
Well this will generate it for you from much more concise notation using nice glob expressions:
```js
 smg: {
    main:{
        steps: {
            1: [
                '**/jquery/jquery.js',
                '**/routes.js'
            ],
            2: ['public/js/**/angular.min.js', '**/bootstrap/js/*.js'],
            3: [
                'public/js/*.js',
                '**/angular-route.min.js',
                '**/js/controllers/*.js',
                '**/js/services/*.js'
            ]
        },
        relativeTo: 'public',
        dest: 'public/scriptLoader.js'
    }
 }
```

instead of providing an object, you can put your steps in a separate node module file and put relative path to the module file as a value for ```steps``` property.
Like this:

```js
 smg: {
    main:{
        steps: '/test/scriptManifest.js',
        relativeTo: 'public',
        dest: 'public/scriptLoader.js'
    }
 }
```

## Getting Started
This plugin requires Grunt `~0.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-smg --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-smg');
```

## The "smg" task

### Overview
In your project's Gruntfile, add a section named `smg` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  smg: {
       steps: {     // each step will get transformed in it's own $script call
           1: ['public/**/*.js'],
           2: ['public/**/*.js'],
           3: ['public/**/*.js']
       },
       readyStr: 'scriptsReady',  // this string will be used as second param for $script call
       relativeTo: 'test/public',  // this path will be omitted from all url paths,
       dest: 'public/modules-definitions.js'
    },
})
```

Prefixed with @ all paths in the step will not be resolved via glob expressions, this can be used to specify remote URLs or paths which are not resolvable in build time.
```js
'@1': ['...URL..'],
```

