[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)

# Assignment 5 ReadMe



## Installation Instructions

1. Make an `.env` file in both the matching-service folder (`/backend/matching-service`) and frontend folder (`/frontend`).
2. Copy the contents of `Assignment5-matching-service-environmentVariables.txt` into the `.env` file in the matching-service folder (`/backend/matching-service`)
3. Copy the contents of `Assignment5-frontend-environmentVariables.txt` into the `.env` file in the frontend folder (`/frontend`)

## Starting the Service
1. Run `docker-compose -f docker.compose.dev.yml up -d` on the root folder
2. Run `cd frontend` from the root folder then run `yarn run dev`
4. Access the frontend via the url `localhost:8080`
5. Access the matching page on the frontend via the url `localhost:8080/match`