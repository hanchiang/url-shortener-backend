all_args=($@)
command=$1
env=$2
rest_args=${all_args[@]:2}

dir=$(dirname $0)
cd $dir
docker-compose -f docker-compose.yml -f docker-compose.$env.yml $command $rest_args