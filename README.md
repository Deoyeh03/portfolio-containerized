# Portfolio - Dockerized

This repository contains the full-stack Portfolio application, valid for Docker deployment.

## Structure

- `frontend/`: Next.js application
- `backend/`: Express.js application
- `docker-compose.yml`: Orchestration file

## Running locally

1. Ensure Docker is installed.
2. Run `docker-compose up --build`.
3. Access:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

## Environment Variables

Ensure `.env` files are present in `frontend/` and `backend/` as needed, or configured in `docker-compose.yml`.
