/*
 * grunt-smg
 * https://github.com/Jiří/smg
 *
 * Copyright (c) 2013 Jiri Spac
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    var path = require('path');
    var glob = require("glob");
    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('smg', 'Plugin for generating $script manifests', function () {
        var data = this.data;
        var output = '$script([';   //beginning
        var counter = 0;

        for(var step in data.steps){
            grunt.log.write('Processing step '+ step +': ');
            var forGlob = data.steps[step];
            forGlob.forEach(function (globExp) {
                glob(globExp, function (er, files) {
                    var fileName;
                    while(fileName = files.pop()){
                        output += fileName + ',';
                    }
                });
            });
            if (data.steps[step + 1]) {
                output += '], function() { $script([';
                counter += 1;
            } else {
                output += '], "scriptManifestReady");';
            }
        }
        while(counter--){
            output += '});';
        }
        grunt.file.write('scriptManifest.js', output);
        grunt.log.writeln('Script manifest has been written.');
    });

};
