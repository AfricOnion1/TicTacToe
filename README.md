# Tic Tac Toe Website

A Tic Tac Toe game website deployed using Docker with animations and history tracking using a connected database initialized from `init.sql`.  
Made as a team project with Frane Ninić  

## Prerequisites

Make sure Docker is running on your system before proceeding.

**Note:** Docker Compose is included with Docker Desktop (Windows/macOS). If you're using Docker on Linux, ensure you have Docker Compose available or [install it separately](https://docs.docker.com/compose/install/linux/).

Make sure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

**Note:** Docker Compose is included with Docker Desktop (Windows/macOS). If you're using Docker on Linux, ensure you have Docker Compose available or [install it separately](https://docs.docker.com/compose/install/linux/).

Make sure Docker is running on your system before proceeding.

## How to Use

### Step 1: Clone the repository

```bash
git clone https://github.com/AfricOnion1/TicTacToe.git
cd TicTacToe
```

### Step 2: Start the Application with Docker Compose

This step automatically sets up the database using `init.sql` and starts both the database and the web application.

```bash
docker-compose up -d
```

- The website will now be accessible at: [http://localhost:8080](http://localhost:8080)

### Step 3: Stopping and Removing Containers

To stop and remove the containers:

```bash
docker-compose down
```

## Project Structure

```plaintext
TicTacToe/
├── Dockerfile
├── docker-compose.yml
├── index.php
├── script.js
├── style.css
├── init.sql
└── README.md
```
