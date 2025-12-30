# Docker

All services, includeing MySQL, data access service and VUE portal, share a virtual network for communicating between the services.

Run this command to build the image on your local machine and start the container. You only need to run this command the first time, and whenever you make changes to docker-compose.yml.

<!-- Docker Ubuntu -->

## Create Ubuntu docker

`docker run -it --name my-ubuntu --network my-proj ubuntu`

`docker exec -it my-ubuntu bash`

<!-- Docker MySQL -->

## Create MySQL docker

Please ensure the docker network my-proj exists. If not, create it using:

`docker network create my-proj`

`docker run --name my-mysql --network my-proj --network-alias my-mysql -e MYSQL_ROOT_PASSWORD=Password01! -d -p 3306:3306 -v C:\Users\zhouwei\docker_mount\mysql94:/var/lib/mysql mysql:9.4` **(Replace the path according to your machine.)**

<!-- Docker data -->

## Create data access service docker

### 1. Build Node

Run `npm run build`

### 2. Deploy data access service to docker

#### Local deployment (data access service)

- `docker compose -f docker-compose.local.yml up --build --no-recreate -d data`
- `docker compose -f docker-compose.local.yml up --build --force-recreate -d data`

#### Production deployment (data access service)

N/A

<!-- Docker VUE -->

## Create VUE portal docker

### 1. Build VUE

Run `npm run build`

### 2. Deploy to docker

#### Local deployment (VUE portal)

- `docker compose -f docker-compose.local.yml up --build --no-recreate -d vue`
- `docker compose -f docker-compose.local.yml up --build --force-recreate -d vue`

#### Production deployment (VUE portal)

N/A

<!-- Docker auth web API -->

## Create Auth Web API docker

### 1. Add WeChat environment variables (compose or docker file)

- `WECHAT_APPID`
- `WECHAT_SECRET`

### Deploy Auth Web API to docker

#### Local deployment (Auth Web API)

- `docker compose -f docker-compose.local.yml up --build --no-recreate -d authapi`
- `docker compose -f docker-compose.local.yml up --build --force-recreate -d authapi`

#### Production deployment (Auth Web API)

N/A

<!-- Docker auth portal -->

## Create Auth portal docker

### Deploy Auth portal to docker

#### Local deployment (Auth portal)

- `docker compose -f docker-compose.local.yml up --build --no-recreate -d authportal`
- `docker compose -f docker-compose.local.yml up --build --force-recreate -d authportal`

#### Production deployment (Auth portal)

N/A

<!-- Docker others -->

## Other docker utility commands

From the second time, we can use `docker-compose up -d`

Now our container is up and you should be able to test it using the following command. `docker-compose ps`
