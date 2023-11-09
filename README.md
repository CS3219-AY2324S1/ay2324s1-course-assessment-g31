# Deploying to Docker Hub
## 1. Build the service image
`cd services/<service_name>`

## 2. Tag the service image
`docker build -t <service_name> .`

## 3. Tag to Docker Hub image
`docker tag <service_name> <dockerhub_username>/cs3219-<service_name>-service`

## 4. Push image to Docker Hub
`docker push <dockerhub_username>/cs3219-<service_name>-service`