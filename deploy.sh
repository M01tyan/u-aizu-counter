#!/bin/sh

git add . && git commit -m 'improving' && git push heroku master && git push origin master
