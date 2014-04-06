/*
 * grunt-smg
 * https://github.com/Jiří/smg
 *
 * Copyright (c) 2013 Jiri Spac
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        smg: {
            test:{
                steps: {
                    '@1': ['test/literal_url.js'],
                    2: ['test/public/1.*'],
                    3: ['test/public/2.*'],
                    4: ['test/public/3.*']
                },
                relativeTo: 'test/public',  // this path will be omitted from all url paths,
                dest: 'test/public/myScriptManifest.js'
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['smg']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
