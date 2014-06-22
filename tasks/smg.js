/*
 * grunt-smg
 *
 * Copyright (c) 2013 Jiri Spac
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    grunt.registerMultiTask('smg', 'Plugin for generating $script manifests', function () {
        var target = this.target;
        var data = this.data;
        var loadedBefore = 0;   //how many scripts were loaded in previous iteration
        var alreadyLoaded = [];
        var readyString = data.readyStr || 'scriptManifestReady';
        var literalSteps = [];
        var commaNewLine = ', \n';
        var output;
        var steps = {};

        if (data.steps) {

            if (typeof data.steps === 'string') {
                var path = process.cwd() + '/' + data.steps;
                grunt.log.writeln('Loading a module with smg steps from: ' + path);
                data.steps = require(path);
            }
            output = '$script([';   //beginning

            for(var step in data.steps) {
                if (step[0] === '@') {
                    var literalStep = step.substr(1);
                    steps[literalStep] = data.steps[step];
                    literalSteps.push(literalStep);
                } else {
                    steps[step] = data.steps[step];
                }
            }
        }

        /**
         * @param {String} fileName
         * @param {Boolean} relative
         */
        var pushIntoOutput = function (fileName, relative) {
            if (alreadyLoaded.indexOf(fileName) === -1) {   //ignore it if it is already been loaded
                if (relative && data.relativeTo) {
                    var relativeUrl = fileName;
                    relativeUrl = relativeUrl.substring(data.relativeTo.length);
                    output += '"' + relativeUrl + '"' + commaNewLine;

                } else {
                    output += '"' + fileName + '"' + commaNewLine;
                }

                alreadyLoaded.push(fileName);
            }
        };

        for(var step in steps){
            var target_step = target + step;    // to allow multiple targets being used at once without collisions, we add target
            grunt.log.writeln('Processing step '+ step +' for target ' + target + ', files: ');
            var stepGlobs = steps[step];
            var fileName;

            if (literalSteps.indexOf(step) !== -1) {
                while(fileName = stepGlobs.pop()){
                    pushIntoOutput(fileName);
                }
            } else {
                var files = grunt.file.expand(stepGlobs);
                if (files && files.length > 0) {
                    grunt.log.writeln(JSON.stringify(files));
                    while(fileName = files.pop()){
                        pushIntoOutput(fileName, true);
                    }
                } else {
                    grunt.log.error('Glob expression/s '+ JSON.stringify(stepGlobs) +' did not match any files!');
                }
            }


            output = output.slice(0, output.length - commaNewLine.length);    // removing the trailing ,
            if (steps[Number(step) + 1] || steps['@' + (Number(step) + 1)]) { //is last
                if (loadedBefore < alreadyLoaded.length) {
                    loadedBefore = alreadyLoaded.length;    //saving how many scripts were loaded after last iteration
                    //nsC = next step ceremony
                    var nsC2ndHalf = '\n $script.ready("' + target_step + '", function(){ $script([';
                    if (!nsC) {
                        nsC = '], "' + target_step + '"); ' + nsC2ndHalf;  //first time
                    } else {
                        var nsC = '], "' + target_step + '");}); ' + nsC2ndHalf;   //all other than first iterations
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
        grunt.log.writeln('Script manifest ' + dest + ' has been written.');
    });

};
