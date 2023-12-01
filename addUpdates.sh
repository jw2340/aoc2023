#! /bin/bash

if [ -z "$1" ]
then
    echo "Pass in the day"
    exit 1
fi

if (( "$1" < 10 ))
then
    day="day0$1"
else
    day="day$1"
fi

echo "Updating readme"
npm run update:readme

echo "Adding updated files"
git add "src/$day"
git add .aocrunner.json
git add README.md
