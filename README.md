# London Transport Dashboard

A real-time visualization dashboard for London's transport system, featuring an interactive map with simulated bus movements and performance metrics.

## Features

- **Interactive Map**
  - Real-time bus tracking (simulated)
  - Station markers for 10 major London stations
  - Popup information for stations and buses
  - Smooth bus movement animation

- **Performance Metrics**
  - Average delay monitoring
  - Reliability tracking
  - Disruption reporting
  - Congestion level monitoring

- **Dashboard**
  - Line status overview
  - Historical performance charts
  - Real-time updates

## Project Structure

```
project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map.tsx           # Map with bus tracking
│   │   │   ├── PerformanceMetrics.tsx  # Metrics display
│   │   │   └── Dashboard.tsx     # Main dashboard
│   │   └── App.tsx              # Main app component
│   ├── public/
│   │   └── metrics.json         # Static data for metrics
│   ├── Dockerfile              # Frontend container config
│   ├── package.json            # Frontend dependencies
│   └── tsconfig.json           # TypeScript config
│
├── docker-compose.yml          # Docker compose config
└── README.md                   # Project documentation
```

## Prerequisites

- Docker Desktop
- Node.js 18+ (for local development)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Start the application**
   ```bash
   docker compose up --build
   ```

3. **Access the application**
   - Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Development

The application is built with:
- React
- TypeScript
- Material-UI
- React-Leaflet (for map visualization)
- Recharts (for data visualization)

### Local Development

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

## Docker Configuration

The application uses Docker for containerization:
- Frontend container runs on port 3000
- Development environment with hot reloading
- Health checks for container monitoring

## Data

The application currently uses static data stored in `frontend/public/metrics.json` for:
- Transport metrics
- Station locations
- Bus routes

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 