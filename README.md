# Docker 

All services, includeing MySQL, data access service and VUE portal, share a virtual network for communicating between the services.

## Create MySQL docker
`docker run --name my-mysql --network my-proj --network-alias my-mysql -e MYSQL_ROOT_PASSWORD=Password01! -d -p 3306:3306 -v C:\Users\周巍\repos\docker\my-mysql\data:/var/lib/mysql mysql:9.4`

## Create data access service docker
Run this command to build the image on your local machine and start the container. You only need to run this command the first time, and whenever you make changes to docker-compose.yml.<br/>
`docker-compose up --build --no-recreate -d`

From the second time, we can use<br/>
`docker-compose up -d`

Now our container is up and you should be able to test it using the following command.<br/>
`docker-compose ps`

## Create VUE portal docker
