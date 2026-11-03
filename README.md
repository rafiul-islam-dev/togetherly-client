# Togetherly

### Small Actions. Stronger Communities.

Togetherly is a community-driven social development events platform where people can discover, create, and participate in local volunteering activities. It helps individuals connect with their communities and contribute to meaningful social initiatives.

## Live Website

**Status:** Not deployed yet.

The live Vercel URL will be added after deployment.

## Key Features

- **Discover Events:** Explore upcoming community service and volunteering events.
- **Create Events:** Create new volunteering opportunities with event details.
- **Join Events:** Participate in events and contribute to community development.
- **Manage Events:** Edit and delete events created by your account.
- **Joined Events:** View your joined events and manage your participation.
- **Secure Authentication:** Register and log in using Better Auth with email/password or Google OAuth.
- **User Profiles:** View and update your profile information and profile picture.
- **Search & Filter:** Find events using search and category filters.
- **Responsive Design:** Optimized for mobile, tablet, and desktop devices.
- **Dark & Light Mode:** Switch between themes for a comfortable experience.

## Technology Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Better Auth

## Project Structure

```text
togetherly/
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   └── package.json
│
└── README.md
```

## Run Locally

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB Atlas account or a local MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd togetherly
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Start the Backend

```bash
npm run dev
```

The backend API will run at:

`http://localhost:5000`

### 4. Setup the Frontend

Open another terminal:

```bash
cd togetherly/client
npm install
```

Create a `.env.local` file inside the `client` directory:

```env
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_API_URL=http://localhost:5000
```

Generate a secure authentication secret and configure your Google OAuth credentials if you want to enable Google login.

### 5. Start the Frontend

```bash
npm run dev
```

Open your browser:

`http://localhost:3000`

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/events` | Get upcoming events |
| GET | `/api/events/:id` | Get event details |
| POST | `/api/events` | Create an event |
| PATCH | `/api/events/:id` | Update an event |
| DELETE | `/api/events/:id` | Delete an event |
| GET | `/api/events/mine` | Get user's own events |
| GET | `/api/joins` | Get joined events |
| POST | `/api/joins/:id` | Join an event |
| DELETE | `/api/joins/:id` | Leave an event |

**Note:** Protected API endpoints require authentication.

## Project Purpose

Togetherly aims to encourage community participation and make local social development activities easier to discover and organize.

By connecting people with meaningful volunteering opportunities, Togetherly helps build stronger communities through small actions.

---

**Built with ❤️ for stronger communities.**