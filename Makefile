up:
	docker compose up --build -d

dev:
	docker compose up postgres backend -d
	cd bookstore-frontend && npm run dev

seed:
	docker compose --profile seed run --rm --build seeder

down:
	docker compose down