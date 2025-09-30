# Blusalt Drone API

This is a RESTful API for managing a fleet of drones for medication delivery.

## About the Project

This project provides a backend service for a drone delivery system. It allows for registering drones, loading them with medications, and monitoring their status.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/blusalt-drone-api.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

### Running the Application

To run the application in development mode, use the following command:

```sh
npm run dev
```

This will start the server on `http://localhost:3000`.

To build and run the application in production mode, use the following commands:

```sh
npm run build
npm start
```

## Running the Tests

To run the automated tests for this system, use the following command:

```sh
npm test
```

## API Endpoints

The following are the available API endpoints:

### Drones

*   `POST /api/v1/drones`: Register a new drone.
*   `GET /api/v1/drones`: Get a list of all drones.
*   `GET /api/v1/drones/available`: Get a list of all available drones for loading.
*   `GET /api/v1/drones/:droneSerialNumber/battery-level`: Get the battery level of a specific drone.
*   `PUT /api/v1/drones/:droneSerialNumber/medications`: Load a drone with medications.
*   `GET /api/v1/drones/:droneSerialNumber/medications`: Get the medications loaded on a specific drone.

## Environment Variables

The following environment variables can be configured in a `.env` file:

*   `PORT`: The port the server will run on (default: `3000`).
*   `DRONE_BATTERY_AUDIT_CRON`: The cron expression for the battery level audit job (default: `*/5 * * * *`).

## Cron Jobs

There is a cron job that runs periodically to audit the battery levels of all drones and create a history log. The default schedule is every 5 minutes.
