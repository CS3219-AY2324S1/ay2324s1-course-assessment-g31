restart_matching_staging:
	docker-compose -f docker-compose.staging.yml down matching postgres_matching_service && \
	docker-compose -f docker-compose.staging.yml up postgres_matching_service -d && \
	docker-compose -f docker-compose.staging.yml up matching --build -d

restart_question_staging:
	docker-compose -f docker-compose.staging.yml down question postgres_question_service && \
	docker-compose -f docker-compose.staging.yml up postgres_question_service -d && \
	docker-compose -f docker-compose.staging.yml up question --build -d

restart_socket_staging:
	docker-compose -f docker-compose.staging.yml down socket && \
	docker-compose -f docker-compose.staging.yml up socket --build -d

restart_user_staging:
	docker-compose -f docker-compose.staging.yml down user postgres_user_service && \
	docker-compose -f docker-compose.staging.yml up postgres_user_service -d && \
	docker-compose -f docker-compose.staging.yml up user --build -d

restart_client_staging:
	docker-compose -f docker-compose.staging.yml down client && \
	docker-compose -f docker-compose.staging.yml up client --build -d

restart_staging:
	docker-compose -f docker-compose.staging.yml down && \
	docker-compose -f docker-compose.staging.yml up --build -d

up_matching_staging:
	docker-compose -f docker-compose.staging.yml up matching -d

up_question_staging:
	docker-compose -f docker-compose.staging.yml up question -d

up_socket_staging:
	docker-compose -f docker-compose.staging.yml up socket -d

up_user_staging:
	docker-compose -f docker-compose.staging.yml up user -d

up_client_staging:
	docker-compose -f docker-compose.staging.yml up client -d

up_staging:
	docker-compose -f docker-compose.staging.yml up -d

format_client:
	cd ./client && yarn run format && cd ..

format_matching:
	cd ./services/matching-service && yarn run format && cd ../..

format_question:
	cd ./services/question-service && yarn run format && cd ../..

format_socket:
	cd ./services/socket-service && yarn run format && cd ../..

format_user:
	cd ./services/user-service && yarn run format && cd ../..

format_all:
	$(MAKE) format_client format_matching format_question format_socket format_user
