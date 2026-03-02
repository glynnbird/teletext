#!/bin/bash
npx rollup -p @rollup/plugin-commonjs -p @rollup/plugin-node-resolve --format=es --file=../functions/api/poll.js -- poll.js
