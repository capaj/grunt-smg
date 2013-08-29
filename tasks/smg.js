/*
 * grunt-smg
 *
 * Copyright (c) 2013 Jiri Spac
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    var path = require('path');

    grunt.registerMultiTask('smg', 'Plugin for generating $script manifests', function () {
        var data = this.data;
        var loadedBefore = 0;   //how many scripts were loaded in previous iteration
        var alreadyLoaded = [];
        var readyString = data.readyStr || 'scriptManifestReady';
        var commaNewLine = ', \n';
        var output;
        if (data.steps) {
            output = '$script([';   //beginning
        }
        for(var step in data.steps){
            grunt.log.writeln('Processing step '+ step +', files: ');
            var stepGlobs = data.steps[step];
            var files = grunt.file.expand(stepGlobs);
            if (files && files.length > 0) {
                grunt.log.writeln(JSON.stringify(files));
                var fileName;
                while(fileName = files.pop()){
                    if (alreadyLoaded.indexOf(fileName) === -1) {   //ignore it if it is already been loaded
                        var relativeUrl = fileName;
                        if (data.relativeTo) {
                            relativeUrl = relativeUrl.substring(data.relativeTo.length);
                        }

                        output += '"' + relativeUrl + '"' + commaNewLine;
                        alreadyLoaded.push(fileName);
                    }
                }
            } else {
                grunt.log.error('Glob expression/s '+ JSON.stringify(stepGlobs) +' did not match any files!');
            }

            output = output.slice(0, output.length - commaNewLine.length);    // removing the trailing ,
            if (data.steps[Number(step) + 1]) { //is last
                if (loadedBefore < alreadyLoaded.length) {
                    loadedBefore = alreadyLoaded.length;    //saving how many scripts were loaded after last iteration
                    //nsC = next step ceremony
                    var nsC2ndHalf = '\n $script.ready("' + step + '", function(){ $script([';
                    if (!nsC) {
                        nsC = '], "' + step + '"); ' + nsC2ndHalf;  //first time
                    } else {
                        var nsC = '], "' + step + '");}); ' + nsC2ndHalf;   //all other than first iterations
                    }
                    output += nsC;
                }
            } else {    //when the last loading step ends, scriptManifestReady will be flagged
                if (loadedBefore == alreadyLoaded.length) {
                    output = output.substring(0, output.length - nsC.length);
                }
                output += '], "' + readyString + '");});';
            }
        }

        var dest = data.dest || 'scriptManifest.js';
        grunt.file.write(dest, output);
        grunt.log.writeln('Script manifest has been written.');
    });

};
