# Tic Tac Toe Website

A Tic Tac Toe game website deployed using Docker with animations and history tracking.  
Made as a team project with Frane Ninić  

## Prerequisites

Make sure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)

## How to Use

### Step 1: Clone the repository

```bash
git clone https://github.com/AfricOnion1/TicTacToe.git
cd TicTacToe
```

### Step 2: Build the Docker Image

```bash
docker build -t tictactoe-website .
```

### Step 3: Run the Docker Container

```bash
docker run -d -p 8080:80 --name tictactoe tictactoe-website
```

- The website will now be accessible at: [http://localhost:8080](http://localhost:8080)

### Stopping the Container

To stop and remove the container:

```bash
docker stop tictactoe
docker rm tictactoe
```

## Project Structure

```plaintext
TicTacToe/
├── Dockerfile
├── docker-compose.yml
├── index.php
├── script.js
├── style.css
└── README.md
```
