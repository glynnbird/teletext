#!/bin/bash
npx rollup -p @rollup/plugin-commonjs -p @rollup/plugin-node-resolve -p @rollup/plugin-terser --format=es --file=../functions/api/poll.js -- poll.js
