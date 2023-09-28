#! /bin/bash

JS_PATH=/home/acs/acapp/game/static/js/
JA_PATH_DIST=${JS_PATH}dist/
JS_PATH_SRC=${JA_PATH_PATH}src/

find $JS_PATH_SRC -type f -name '*.js' | sort | xargs cat > ${JA_PATH_DIST}game.js


