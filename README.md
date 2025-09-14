# Docker 

All services, includeing MySQL, data access service and VUE portal, share a virtual network for communicating between the services.

## Create MySQL docker

`docker run --name my-mysql --network my-proj --network-alias my-mysql -e MYSQL_ROOT_PASSWORD=Password01! -d -p 3306:3306 -v C:\Users\周巍\repos\docker\my-mysql\data:/var/lib/mysql mysql:9.4` **(Replace the path according to your machine.)**

## Create data access service docker

### 1. Build VUE
Run `npm run build`

### 2. Deploy to docker
Run this command to build the image on your local machine and start the container. You only need to run this command the first time, and whenever you make changes to docker-compose.yml.

#### Local deployment
- `docker compose -f docker-compose.local.yml up --build --no-recreate -d data`
- `docker compose -f docker-compose.local.yml up --build --force-recreate -d data`

#### Production deployment
*N/A*

## Create VUE portal docker

### 1. Build VUE
Run `npm run build`

### 2. Deploy to docker
Run this command to build the image on your local machine and start the container. You only need to run this command the first time, and whenever you make changes to docker-compose.yml.

#### Local deployment
- `docker compose -f docker-compose.local.yml up --build --no-recreate -d vue`
- `docker compose -f docker-compose.local.yml up --build --force-recreate -d vue`

#### Production deployment
*N/A*

## Create Auth portal docker

### Deploy to docker
Run this command to build the image on your local machine and start the container. You only need to run this command the first time, and whenever you make changes to docker-compose.yml.

#### Local deployment
- `docker compose -f docker-compose.local.yml up --build --no-recreate -d authapi`
- `docker compose -f docker-compose.local.yml up --build --force-recreate -d authapi`

#### Production deployment
*N/A*

## Other docker utility commands

From the second time, we can use `docker-compose up -d`

Now our container is up and you should be able to test it using the following command. `docker-compose ps`
