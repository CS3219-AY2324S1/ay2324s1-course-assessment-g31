restart_matching_staging:
	docker-compose -f docker-compose.staging.yml up matching --build -d

restart_question_staging:
	docker-compose -f docker-compose.staging.yml up question --build -d

restart_socket_staging:
	docker-compose -f docker-compose.staging.yml up socket --build -d

restart_user_staging:
	docker-compose -f docker-compose.staging.yml up user --build -d

restart_client_staging:
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
	cd ./frontend && yarn run format && cd ..

format_matching:
	cd ./backend/matching-service && yarn run format && cd ../..

format_question:
	cd ./backend/question-service && yarn run format && cd ../..

format_socket:
	cd ./backend/socket-service && yarn run format && cd ../..

format_user:
	cd ./backend/user-service && yarn run format && cd ../..

format_all:
	$(MAKE) format_client format_matching format_question format_socket format_user
