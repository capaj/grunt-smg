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

    grunt.registerMultiTask('smg', 'Plugin for generating $script manifests', function () {
        var data = this.data;
        var loadedBefore = 0;   //how many scripts were loaded in previous iteration
        var alreadyLoaded = [];
        var readyString = data.readyStr || 'scriptManifestReady';
        var betweenSteps = '], function() { $script([';
        var commaNewLine = ', \n';
        var output;
        var endingBracketsCounter = 0;
        if (data.steps) {
            output = '$script([';   //beginning
        }
        for(var step in data.steps){
            grunt.log.writeln('Processing step '+ step +', files: ');
            var stepGlobs = data.steps[step];

            stepGlobs.forEach(function (globExp) {
                var files = glob.sync(globExp);
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
                    grunt.log.error('Glob expression '+ globExp +' did not match any files!');
                }
            });
            output = output.slice(0, output.length - commaNewLine.length);    // removing the trailing ,
            if (data.steps[Number(step) + 1]) {
                if (loadedBefore < alreadyLoaded.length) {
                    loadedBefore = alreadyLoaded.length;    //saving how many scripts were loaded after last iteration
                    output += betweenSteps;
                    endingBracketsCounter += 1;
                }
            } else {    //when the last loading step ends, scriptManifestReady will be flagged
                if (loadedBefore == alreadyLoaded.length) {
                    output = output.substring(0, output.length - betweenSteps.length);
                    endingBracketsCounter -= 1;
                }
                output += '], "' + readyString + '");';
            }
        }
        while(endingBracketsCounter--){
            output += '});';
        }
        var dest = data.dest || 'scriptManifest.js';
        grunt.file.write(dest, output);
        grunt.log.writeln('Script manifest has been written.');
    });

};
