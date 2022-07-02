#!/bin/bash

all_args=($@)
env=$1
command=$2
rest_args=${all_args[@]:2}

dir=$(dirname $0)
cd $dir
docker-compose -f docker-compose.yml -f docker-compose.$env.yml $command $rest_args