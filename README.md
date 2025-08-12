
# GreenCart Logistics

## 1. Project Overview & Purpose

GreenCart Logistics is an eco-friendly delivery simulation and KPI dashboard application designed to help logistics managers optimize urban delivery operations. Users can simulate delivery scenarios by specifying driver availability, route start times, and maximum working hours per driver. The app calculates key performance indicators (KPIs) such as delivery efficiency, driver workload, and profitability to help improve operational decision-making.

---

## 2. Setup Steps

To get started locally:

1. Clone the repository.
2. Install backend dependencies.
3. Set up backend environment variables.
4. Install frontend dependencies.
5. Set up frontend environment variables.
6. Run backend and frontend servers.
7. Open the app in your browser at `http://localhost:3000`.

---

## 3. Tech Stack Used

- **Backend:** Node.js, Express.js, MongoDB with Mongoose
- **Frontend:** React.js, Chart.js for KPI visualization
- **API Documentation:** Swagger UI / Postman (optional)
- **Environment Management:** dotenv for configuration

---

## 4. Setup Instructions

### Backend Setup

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
````

2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file inside the `backend` folder with the variables listed below.
4. Start the backend server:

   ```bash
   npm start
   ```
5. Backend server will run at:

   ```
   http://localhost:5000
   ```

---

### Frontend Setup

1. Open a new terminal window/tab and navigate to the frontend folder:

   ```bash
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file inside the `frontend` folder with the variables listed below.
4. Start the frontend server:

   ```bash
   npm start
   ```
5. Frontend app will be available at:

   ```
   http://localhost:3000
   ```

---

## 5. Environment Variables

### Backend `.env` file (place inside `backend/`)

```
MONGO_URI=mongodb://localhost:27017/greencart
PORT=5000
JWT_SECRET=your_jwt_secret_key_here 
```

---

### Frontend `.env` file (place inside `frontend/`)

```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 6. Deployment Instructions (Local Development)

For local development, simply run the backend and frontend servers as described above.

For production deployment (on servers or cloud platforms):

1. Build the React frontend:

   ```bash
   cd frontend
   npm run build
   ```
2. Serve the frontend build folder using a static server or configure your backend to serve these static files.
3. Deploy backend on your server or platform.
4. Set environment variables on the server accordingly.
5. Ensure MongoDB instance is running and accessible.
6. Start backend in production mode using process managers like `pm2`.

---

## 7. API Documentation

### 7.1 Run Delivery Simulation

* **Endpoint:**
  `POST http://localhost:5000/api/simulation`

* **Description:**
  Runs a delivery simulation with the provided parameters and returns key metrics.

* **Request Headers:**
  `Content-Type: application/json`

* **Request Body Example:**

  ```json
  {
    "availableDrivers": 5,
    "routeStartTime": "09:00",
    "maxHoursPerDriver": 5
  }
  ```

* **Successful Response Example:**

  ```json
  {
    "success": true,
    "simulationId": "60d0fe4f5311236168a109ca",
    "results": {
      "totalDeliveries": 120,
      "averageDeliveryTime": 35,
      "driverUtilization": 0.8,
      "profit": 4500
    }
  }
  ```

* **Error Response Example:**

  ```json
  {
    "success": false,
    "message": "Invalid input data"
  }
  ```

---

### 7.2 Fetch Simulation History

* **Endpoint:**
  `GET http://localhost:5000/api/simulation/history`

* **Description:**
  Retrieves the history of all past delivery simulations.

* **Request Headers:**
  None required

* **Successful Response Example:**

  ```json
  [
    {
      "simulationId": "60d0fe4f5311236168a109ca",
      "date": "2025-08-12T14:30:00Z",
      "results": {
        "totalDeliveries": 120,
        "averageDeliveryTime": 35,
        "driverUtilization": 0.8,
        "profit": 4500
      }
    },
    {
      "simulationId": "60d0fe4f5311236168a109cb",
      "date": "2025-08-13T10:15:00Z",
      "results": {
        "totalDeliveries": 110,
        "averageDeliveryTime": 38,
        "driverUtilization": 0.75,
        "profit": 4300
      }
    }
  ]
  ```

* **Error Response Example:**

  ```json
  {
    "success": false,
    "message": "Failed to fetch simulation history"
  }
  ```

---


Thank you for using **GreenCart Logistics** — happy simulating! 🚚🌿

```

```
