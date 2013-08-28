/*
 * grunt-smg
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
        grunt.log.writeln(JSON.stringify(data));

        for(var step in data.steps){
            grunt.log.writeln('Processing step '+ step +': ');
            var forGlob = data.steps[step];
            grunt.log.writeln(JSON.stringify(forGlob));

            forGlob.forEach(function (globExp) {
                glob(globExp, function (er, files) {
                    grunt.log.writeln(JSON.stringify(files));

                    var fileName;
                    while(fileName = files.pop()){
                        output += fileName + ',';
                    }
                });
            });
            if (data.steps[Number(step) + 1]) {
                output += '], function() { $script([';
                counter += 1;
            } else {    //when the last should run
                output += '], "scriptManifestReady");';
            }
        }
        if (counter == 0) {
            output += '], "scriptManifestReady");';
        }
        while(counter--){
            output += '});';
        }
        var dest = data.dest || 'scriptManifest.js';
        grunt.file.write(dest, output);
        grunt.log.writeln('Script manifest has been written.');
    });

};
