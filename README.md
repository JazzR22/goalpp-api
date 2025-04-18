# goalpp-api
API for managing user goals with custom timeframes, habit tracking, and real-time progress validation.

GoalPP is a RESTful Node.js API that allows users to register personal goals with monthly progress tracking. Each goal includes start/end dates, automatically generated monthly breakdowns, and per-day completion status. The app also supports secure user authentication via JWT.

---
## Tech Stack
- **Node.js** with **Express**
- **MongoDB** via **Mongoose**
- **JWT Authentication**
- Modular architecture (Controller / Service / Repository)
- Custom error handling with `AppError` and `ErrorFactory`

---
## Setup
#### Clone the repo
git clone https://github.com/JazzR22/goalpp-api.git
cd goalpp-api

#### Install dependencies
npm install

#### Set up .env
cp .env.example .env
#### Add your Mongo URI and JWT_SECRET

#### Start server
npm run dev

---

## Frontend Repo

> [🔗 See frontend repo](https://github.com/JazzR22/goalpp-web) 

---

## License

MIT © Jazmin S.R.
