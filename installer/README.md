# Torqbit Docker Installer

One-command installer to set up and run Toq via Docker Compose.

## Usage

- Run via npx :

```bash
npx @torqbit/toq
```

- What it does:

  - Checks for Docker and Docker Compose.
  - Writes a `docker-compose.yml` to your current directory (asks before overwriting).
  - Starts the stack with `docker compose up -d --build`.

- Services exposed by default:
  - Web: http://localhost:8080
  - MySQL: localhost:3360
  - Qdrant: http://localhost:6333

## Customize

- Edit the generated `docker-compose.yml` to adjust ports, passwords, or environment variables. Notably:
  - `NEXTAUTH_SECRET`, SMTP settings, and `ADMIN_EMAIL` are placeholders; set real values before production use.
  - If you prefer to build locally, add back `build: .` under `services.web` and ensure the working directory contains the Dockerfile and app source.

## Troubleshooting

- Docker not found: Install Docker Desktop https://www.docker.com/products/docker-desktop/
- Compose command not found: Recent Docker includes `docker compose`. Older setups use `docker-compose`.
- Ports already in use: Change host ports in `docker-compose.yml` (e.g. `8080:8080` to `8081:8080`).
