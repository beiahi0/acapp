#! /bin/bash

# JS_PATH=/home/jackson/code/py/acapp/game/static/js/
JS_PATH=/home/jackson/code/py/Django/acapp/game/static/js/

JS_PATH_DIST=${JS_PATH}dist/
JS_PATH_SRC=${JS_PATH}src/

find $JS_PATH_SRC -type f -name '*.js' | sort | xargs cat > ${JS_PATH_DIST}game.js


