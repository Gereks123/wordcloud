# Word Cloud

A microservices application that accepts a plain text file upload, counts word frequencies across the file, and renders the results as an interactive word cloud.

## How it works

1. The **frontend** accepts a file upload (up to 100 MB) and sends it to the core service.
2. The **core service** splits the file into 1 MB chunks and publishes each chunk as a message to RabbitMQ.
3. The **worker service** consumes each chunk, tokenises the text, filters stop words, and upserts word counts into PostgreSQL.
4. Once all chunks are processed the worker marks the submission as complete.
5. The **frontend** polls every 2 seconds until the submission is complete, then displays the word cloud and a sortable word count table.

## Architecture

```
Browser
  └── Frontend (React + Vite)
        └── /api/* → proxied to Core
              └── Core (Spring Boot)
                    └── RabbitMQ (wordcloud.chunks queue)
                          └── Worker (Spring Boot)
                                └── PostgreSQL
```

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, react-dropzone, d3-cloud |
| Core service | Java 21, Spring Boot 3.4.1, Spring AMQP, Spring Data JPA, Flyway |
| Worker service | Java 21, Spring Boot 3.4.1, Spring AMQP, Spring Data JPA |
| Database | PostgreSQL 16 |
| Message broker | RabbitMQ 3.13 |
| Container | Docker + Docker Compose |

## Prerequisites

- [Docker](https://www.docker.com/) with Docker Compose

That is the only requirement. All services build and run inside containers.

## Quick start

```bash
# Clone the repository
git clone <https://github.com/Gereks123/wordcloud.git>

# Build and start all services
docker compose up --build
```

Once all containers are healthy, open [http://localhost:3000](http://localhost:3000) in your browser.

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Core API | http://localhost:8080 |
| RabbitMQ management | http://localhost:15672 (guest / guest) |
| PostgreSQL | localhost:5432 (wordcloud / wordcloud) |

## Running services individually (local dev)

Each service can also be run locally outside Docker, provided PostgreSQL and RabbitMQ are reachable (e.g. via `docker compose up postgres rabbitmq`).

### Core service

```bash
cd wordcloud-core
./gradlew bootRun
```

### Worker service

```bash
cd wordcloud-worker
./gradlew bootRun
```

### Frontend

```bash
cd wordcloud-frontend
npm install
npm run dev
```

The Vite dev server starts on [http://localhost:5173](http://localhost:5173). API calls are proxied to `http://localhost:8080` via the Vite config.

## Supported file types

`.txt`, `.text`, `.md`, `.csv`, `.log` — maximum 100 MB.
