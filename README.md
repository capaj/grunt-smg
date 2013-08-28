# grunt-smg

> Plugin for generating $script manifests

## Getting Started
This plugin requires Grunt `~0.4.1`

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

```js
steps
```

