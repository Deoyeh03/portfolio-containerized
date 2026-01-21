# Portfolio (Containerized)

A scalable, containerized full-stack portfolio application engineered with **Next.js 14**, **Node.js/Express**, and **MongoDB**. This repository represents the production-ready, Dockerized infrastructure for the project.

## 🚀 Architecture

The application is composed of three isolated services orchestrated via Docker Compose:

- **Frontend**: Next.js 14 (App Router) application serving the user interface.
- **Backend**: Express.js REST API handling logical operations and database communication.
- **Database**: MongoDB container for persistent data storage.

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 (React 19)
- **Styling**: Tailwind CSS, Framer Motion, GSAP
- **3D/Visuals**: Three.js, React Three Fiber
- **Language**: TypeScript

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Security**: Helmet, Rate Limiting, CORS, XSS-Clean

## 📦 Prerequisites

- **Docker Engine** (v20.10+)
- **Docker Compose** (v2.0+)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Deoyeh03/portfolio-containerized.git
cd portfolio-containerized
```

### 2. Environment Configuration

The application comes pre-configured for local containerized development.

- The **frontend** container is configured to talk to the backend via the internal Docker network.
- The **backend** container is configured to talk to MongoDB via the internal service name `mongo`.

If you need to override defaults, create `.env` files in `frontend/` and `backend/` directories respectively.

### 3. Build and Run

Execute the following command to build the images and spin up the containers:

```bash
docker-compose up --build -d
```

### 4. Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Database**: Port `27017` (Internal)

## 🐳 Docker Commands

| Command                          | Description                             |
| :------------------------------- | :-------------------------------------- |
| `docker-compose up --build`      | Build and start all services            |
| `docker-compose down`            | Stop and remove containers and networks |
| `docker-compose logs -f`         | Tail logs from all containers           |
| `docker-compose restart backend` | Restart a specific service              |

## 📁 Project Structure

```bash
.
├── backend/                # Express.js Server
│   ├── src/                # Source code
│   └── Dockerfile          # Backend image configuration
├── frontend/               # Next.js Application
│   ├── app/                # App Router pages
│   ├── components/         # UI Components
│   └── Dockerfile          # Frontend image configuration
└── docker-compose.yml      # Service orchestration
```

## 🔐 Security & Production Notes

- **Network Isolation**: Containers communicate over a private bridge network; only ports 3000 (app) and 5000 (api) are exposed.
- **Non-Root Users**: Production Dockerfiles should ideally be configured to run as non-root users for enhanced security (pending update).
- **Data Persistence**: MongoDB data is persisted in the `mongo-data` volume.

## 📄 License

[MIT](LICENSE)
