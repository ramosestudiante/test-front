run-local:
	docker-compose -f ./docker/docker-compose.local.yml --project-directory ./ -p vue-vite down && \
	docker-compose -f ./docker/docker-compose.local.yml --project-directory ./ -p vue-vite build --no-cache && \
	docker-compose -f ./docker/docker-compose.local.yml --project-directory ./ -p vue-vite up -d


stop-local:
	@docker-compose -f ./docker/docker-compose.local.yml --project-directory ./ -p vue-vite down

rm-local:
	@docker-compose -f ./docker/docker-compose.local.yml --project-directory ./ -p vue-vite down -v --remove-orphans

tests:
	@docker exec vue-vite npm run test

test-coverage:
	@docker exec vue-vite php npm run coverage

# git flow

prod\:release:
	./scripts/release.sh


prod\:tag:
	./scripts/tag.sh