#!/usr/bin/env node
/**
 * Buildify
 *
 * Builder for creating distributable JavaScript files from source.
 * Concatenate, wrap, uglify.
 *
 * Usage:
 *     buildify [tasks]
 *
 * The application will execute the script named `buildify.js` in the current
 * directory.
 *
 * The option tasks is an optional list with task names to be executed.
 * If no tasks are provided, buildify will run the script including all tasks.
 */

// read build script from current directory
require(process.cwd() + '/buildify.js');
