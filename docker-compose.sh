#!/bin/bash

all_args=($@)
env=$1
command=$2
rest_args=${all_args[@]:2}  # 3rd argument to the end

dir=$(dirname $0)
cd $dir
docker-compose -f docker-compose.yml -f docker-compose.$env.yml $command $rest_args