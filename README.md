# 🏘️ MGNREGA District Performance Tracker

A full-stack web application that enables citizens, government officials, and researchers to track and compare MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) performance data across districts in Andhra Pradesh. Built with a React frontend and a Node.js/Express backend that reads from official government CSV data.

---

## 📋 Table of Contents

- [About MGNREGA](#about-mgnrega)
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Source](#data-source)
- [Deployment](#deployment)
  - [Backend (Render)](#backend-render)
  - [Frontend (Netlify)](#frontend-netlify)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About MGNREGA

**MGNREGA** (महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम) is India's flagship rural employment scheme that legally guarantees every rural household **100 days of wage employment per financial year**.

Key objectives:
- Provide livelihood security to rural households
- Create durable community assets
- Strengthen the livelihood resource base of the rural poor
- Ensure social inclusion — with at least **33% participation reserved for women**

---

## 🚀 Project Overview

This tracker provides a **transparent, easy-to-understand view** of how MGNREGA is performing across all **26 districts of Andhra Pradesh** for Financial Year 2025-26.

Users can:
1. **Browse all 26 districts** and select a district of interest
2. **View a detailed performance dashboard** for that district
3. **Compare all districts side-by-side** across multiple metrics

Data is sourced directly from the Government of India's official MGNREGA Management Information System (MIS) and served via a REST API backend.

---

## ✨ Features

### 🏠 Home Page
- Bilingual interface (Hindi + English)
- Hero section with state-wide aggregate statistics (employment, person-days, women participation)
- District grid with all 26 Andhra Pradesh districts
- Click-to-select district with automatic navigation to the dashboard
- Live data status indicator

### 📊 District Dashboard
- Overall performance score (Work Completion Rate %)
- **6 key metric cards**:
  - 👥 Employment Generated (households)
  - ⏱️ Total Person-Days
  - 🏗️ Work Completion Rate (completed vs. total works)
  - 📅 Average Days of Employment per Household
  - 👩 Women Participation Rate
  - ⚡ Active Workers count
- Interactive performance charts (Chart.js)
- Performance summary with target comparison
- Data reliability indicators (government-verified, real-time)

### 📈 Comparison Page
- Compare all 26 districts simultaneously
- Switchable metrics: Employment, Work Completion, Women Participation, Average Days
- Sortable: alphabetical or by metric value
- Bar chart visualization using Chart.js
- Responsive data table

### ⚙️ Backend API
- CSV file-based data serving (dynamic loading with file modification detection)
- In-memory caching with configurable TTLs
- Rate limiting (100 requests per 15 minutes per IP)
- CORS, Helmet, and Compression middleware
- Structured logging with Winston
- Health check and cache statistics endpoints

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Chart.js + react-chartjs-2 | Data visualizations |
| Framer Motion | Animations |
| MUI (Material UI) | Component library |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP client |
| react-hot-toast | Toast notifications |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js (≥18) | Runtime |
| Express 4 | Web framework |
| csv-parser | Reading government CSV data |
| Winston | Logging |
| Helmet | Security headers |
| CORS | Cross-origin resource sharing |
| express-rate-limit | API rate limiting |
| compression | Response compression |
| node-cron | Scheduled tasks |
| dotenv | Environment variable management |

### Infrastructure
| Service | Purpose |
|---|---|
| Render | Backend hosting |
| Netlify | Frontend hosting |
| Firebase (optional) | Authentication / storage (configured but optional) |

---

## 📁 Project Structure

```
MGNREGA-Tracker/
├── backend/
│   ├── src/
│   │   ├── app.js                  # Express app entry point
│   │   ├── config/
│   │   │   ├── firebase.js         # Firebase config
│   │   │   └── firebase.template.js
│   │   ├── data/
│   │   │   └── mgnrega_data.csv    # Government CSV data file
│   │   ├── middleware/
│   │   │   └── error.js            # Global error handler
│   │   ├── routes/
│   │   │   ├── api.js              # Main API routes
│   │   │   └── health.js           # Health check route
│   │   ├── services/
│   │   │   ├── csvDataService.js   # CSV reading & processing
│   │   │   ├── simpleCacheService.js # In-memory caching
│   │   │   ├── apiService.js
│   │   │   ├── cacheService.js
│   │   │   ├── dataService.js
│   │   │   ├── fallbackCache.js
│   │   │   ├── firebaseService.js
│   │   │   └── realMgnregaService.js
│   │   └── utils/
│   │       └── logger.js           # Winston logger
│   ├── .env                        # Environment variables (not committed)
│   └── package.json
│
├── frontend/
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── App.js                  # Root component, routing
│   │   ├── pages/
│   │   │   ├── Home.jsx            # District selection page
│   │   │   ├── Dashboard.jsx       # District performance dashboard
│   │   │   └── Comparison.jsx      # Multi-district comparison
│   │   ├── components/
│   │   │   ├── charts/             # Chart components (Chart.js)
│   │   │   ├── common/             # Header, Footer
│   │   │   ├── layout/             # Layout wrappers
│   │   │   └── ui/                 # Reusable UI components
│   │   ├── services/
│   │   │   └── mgnregaDataService.js # API calls to backend
│   │   ├── theme/                  # MUI / global theme
│   │   ├── App.css
│   │   └── index.css
│   ├── netlify.toml                # Netlify deployment config
│   └── package.json
│
├── render.yaml                     # Render deployment config
└── README.md
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v8 or higher

Check your versions:
```bash
node --version
npm --version
```

---

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create the environment file:**
   ```bash
   cp .env .env.local
   ```
   Edit `.env` with your values (see [Environment Variables](#environment-variables)).

4. **Add the CSV data file** (optional — falls back to sample data):

   Place the official government MGNREGA CSV export at:
   ```
   backend/src/data/mgnrega_data.csv
   ```

   The CSV must have these columns:
   | Column | Description |
   |---|---|
   | `fin_year` | Financial year (e.g. `2025-2026`) |
   | `state_name` | State name (e.g. `ANDHRA PRADESH`) |
   | `district_name` | District name |
   | `Total_Households_Worked` | Households that received employment |
   | `Total_Individuals_Worked` | Total individuals who worked |
   | `Average_days_of_employment_provided_per_Household` | Average days per household |
   | `Women_Persondays` | Person-days generated by women |
   | `Total_No_of_Works_Takenup` | Total works taken up |
   | `Number_of_Completed_Works` | Works completed |
   | `Total_No_of_Active_Workers` | Active workers |
   | `Persondays_of_Central_Liability_so_far` | Total person-days (central liability) |
   | `Total_No_of_Active_Job_Cards` | Active job cards |
   | `Wages` | Total wages paid |

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   The backend starts on **http://localhost:5000**.

   Available endpoints printed on startup:
   ```
   📊 Health check:       http://localhost:5000/health
   📈 Cache stats:        http://localhost:5000/cache-stats
   📁 Data source status: http://localhost:5000/api/data-source/status
   🏘️  Districts:         http://localhost:5000/api/districts/Andhra%20Pradesh
   📱 Performance:        http://localhost:5000/api/performance/Andhra%20Pradesh/Srikakulam
   ```

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The frontend starts on **http://localhost:3000** and proxies API calls to `http://localhost:5000`.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The production-ready build is output to `frontend/build/`.

---

## 🔧 Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000        # Set to your Netlify URL in production

# Data.gov.in API Configuration (Fallback source)
DATA_GOV_BASE_URL=https://api.data.gov.in/resource/
MGNREGA_RESOURCE_ID=9ef84268-d588-465a-a308-a864a43d0070
API_KEY=your_data_gov_api_key

# Real MGNREGA Data Sources
NREGA_STATE_REPORT_BASE=https://nrega.dord.gov.in/MGNREGA_new/
BHUVAN_MGNREGA_BASE=https://bhuvan-app2.nrsc.gov.in/mgnrega/
NREGA_SOFT_BASE=https://nregaplus.nic.in/netnrega/

# Cache Configuration (seconds)
CACHE_TTL_DISTRICTS=3600     # 1 hour
CACHE_TTL_PERFORMANCE=1800   # 30 minutes

# Logging
LOG_LEVEL=info

# Firebase Configuration (optional)
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-client-cert-url
FIREBASE_UNIVERSE_DOMAIN=googleapis.com
FIREBASE_STORAGE_BUCKET=your-storage-bucket
```

> ⚠️ **Never commit `.env` files with real credentials to version control.**

---

## 📡 API Reference

Base URL (development): `http://localhost:5000`

### Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-04-01T10:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0"
}
```

---

### Cache Statistics

```
GET /cache-stats
```

**Response:**
```json
{
  "success": true,
  "stats": { "hits": 42, "misses": 5, "keys": 12 },
  "timestamp": "2025-04-01T10:00:00.000Z"
}
```

---

### Data Source Status

```
GET /api/data-source/status
```

**Response:**
```json
{
  "success": true,
  "fileStatus": {
    "csvPath": "/path/to/mgnrega_data.csv",
    "fileExists": true,
    "lastModified": "2025-03-31T08:00:00.000Z",
    "cacheLoaded": true,
    "districtCount": 26,
    "dataSource": "CSV File"
  }
}
```

---

### Refresh Data

```
POST /api/data-source/refresh
```

Forces a reload of the CSV file into memory.

---

### Get Districts for a State

```
GET /api/districts/:stateName
```

**Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `stateName` | string | State name (URL-encoded, e.g. `Andhra%20Pradesh`) |

**Example:**
```
GET /api/districts/Andhra%20Pradesh
```

**Response:**
```json
{
  "success": true,
  "districts": ["Alluri Sitharama Raju", "Anakapalli", "Anantapur", "..."],
  "total": 26,
  "source": "csv_file_dynamic",
  "lastUpdated": "2025-04-01T10:00:00.000Z",
  "dataSource": "Government CSV File"
}
```

---

### Get District Performance

```
GET /api/performance/:stateName/:districtName
```

**Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `stateName` | string | State name (URL-encoded) |
| `districtName` | string | District name (URL-encoded) |

**Example:**
```
GET /api/performance/Andhra%20Pradesh/Srikakulam
```

**Response:**
```json
{
  "success": true,
  "performance": {
    "employmentGenerated": 1742500,
    "personDaysGenerated": 77604001,
    "avgDaysPerHousehold": 32,
    "womenParticipation": 60,
    "workCompletionRate": 85,
    "totalWorks": 452035,
    "completedWorks": 19563,
    "activeWorkers": 4217374,
    "demandRegistered": 2392861,
    "workProvided": 2406400,
    "totalWages": 23281200400,
    "dataAvailable": true,
    "source": "csv_file_real_time",
    "lastUpdated": "2025-04-01T10:00:00.000Z"
  },
  "metadata": {
    "state": "Andhra Pradesh",
    "district": "Srikakulam",
    "dataSource": "Government CSV File - Dynamic Loading"
  }
}
```

---

### Get Comparative Data

```
GET /api/comparative/:stateName
```

Returns aggregated comparison metrics for all districts in the state.

**Example:**
```
GET /api/comparative/Andhra%20Pradesh
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "district": "Alluri Sitharama Raju",
      "employmentGenerated": 980000,
      "workCompletionRate": 82,
      "womenParticipation": 63,
      "avgDaysPerHousehold": 29
    }
  ],
  "state": "Andhra Pradesh",
  "totalDistricts": 26
}
```

---

## 📂 Data Source

The application uses **official government MGNREGA data**:

| Source | URL |
|---|---|
| Primary — Government CSV | [MGNREGA MIS](https://nregaplus.nic.in/netnrega/) |
| Fallback — Data.gov.in API | [api.data.gov.in](https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070) |
| Geo / BHUVAN | [bhuvan-app2.nrsc.gov.in](https://bhuvan-app2.nrsc.gov.in/mgnrega/) |

**Data Loading Behaviour:**
1. On startup, the backend checks for `backend/src/data/mgnrega_data.csv`
2. If found, it streams and parses the CSV file, groups records by district, and builds an aggregated in-memory cache
3. If the file is not found, it falls back to a built-in sample dataset covering all 26 Andhra Pradesh districts
4. The cache is invalidated automatically when the CSV file modification timestamp changes
5. A `POST /api/data-source/refresh` call forces an immediate reload

---

## 🚢 Deployment

### Backend (Render)

The `render.yaml` file in the root configures the backend as a **Web Service** on [Render](https://render.com).

**Steps:**
1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → Blueprint
3. Connect your repository
4. Render will auto-detect `render.yaml` and create the service
5. Set any secret environment variables (e.g. `FIREBASE_PRIVATE_KEY`) in the Render dashboard under **Environment**
6. Update `FRONTEND_URL` to your deployed Netlify URL

**Key configuration in `render.yaml`:**
```yaml
services:
  - type: web
    name: mgnrega-backend
    env: node
    buildCommand: cd backend && npm install
    startCommand: node src/index.js
    envVars:
      - key: PORT
        value: 10000
      - key: NODE_ENV
        value: production
```

---

### Frontend (Netlify)

The `frontend/netlify.toml` file configures the frontend for [Netlify](https://netlify.com).

**Steps:**
1. Go to [netlify.com](https://netlify.com) → New site from Git
2. Connect your repository and set:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/build`
3. Add an environment variable:
   - `REACT_APP_API_URL` → your Render backend URL (e.g. `https://mgnrega-backend.onrender.com`)
4. Netlify will configure SPA routing via the redirect rule in `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork** the repository
2. Create a **feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** with clear, focused commits
4. **Test** your changes locally (both backend and frontend)
5. Open a **Pull Request** with a clear description of what you changed and why

### Reporting Issues

Please open a [GitHub Issue](../../issues) with:
- A clear title and description
- Steps to reproduce the problem
- Expected vs. actual behaviour
- Screenshots (if applicable)

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- Data provided by the **Government of India** — [MGNREGA Management Information System](https://nregaplus.nic.in/netnrega/)
- Funded and mandated under the [Mahatma Gandhi NREGA Act, 2005](https://www.indiacode.nic.in/handle/123456789/2011)
- Built to improve **transparency and citizen access** to public employment data

---

*Made with ❤️ for rural India*
