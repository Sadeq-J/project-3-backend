# MAIDAN Backend API

## Overview
This repository contains the Node.js, Express, and MongoDB backend for **MAIDAN** — a Sports Venue Booking & Matchmaking Platform. It powers authentication, slot reservations with double-booking prevention, team auto-balancing, match challenge creation/acceptance, user profile networks, real-time notifications, and administrative platform management.

## Related Links
- **Backend API:** `http://localhost:3000`
- **Frontend Application:** `http://localhost:5173`
- **Frontend Repository:** [MAIDAN Frontend](https://github.com/Sadeq-J/project-3-frontend/tree/main/src/pages)

## Technologies Used
- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- dotenv
- Morgan
- Multer
- ImageKit / Cloudinary
- Express Rate Limit
- CORS
- Jest
- Supertest

## Features
- User registration and password hashing
- User login with JWT token issuance
- Authentication & Admin authorization middleware
- Venue CRUD operations with multi-image upload support
- Hourly slot reservation system with conflict validation
- Group team auto-splitting (Team A & Team B)
- Match Challenge creation and 1-click match acceptance
- Follow/Unfollow player social network
- In-app notification system (invitations, follow alerts)
- Clear error handling with proper HTTP status codes
- Search and filtering for venues and friends
- Automated integration tests with Jest and Supertest
- Role-based authorization (`admin` vs `user`)

## Project Structure
```
project-3-backend/
├── .github/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── tests/
├── uploads/
├── .env
├── app.js
├── package.json
└── server.js
```

## Folder Responsibilities
| Folder | Purpose |
| :--- | :--- |
| `config` | Database and application configuration |
| `controllers` | HTTP request and response handling |
| `middleware` | Authentication, validation, and error middleware |
| `models` | Mongoose schemas and models |
| `routes` | Express route definitions |
| `tests` | Automated tests |
| `uploads` | Local file storage directory |
| `app.js` | Express application configuration |
| `server.js` | Database connection and server startup |

## Getting Started

### Prerequisites
Install the following before running the project:
- Node.js (v18.x or higher)
- MongoDB locally or a MongoDB Atlas account

### Installation
1. **Clone the repository / navigate to backend directory:**
   ```bash
   cd project-3-backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create the environment file:**
   Create `.env` in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/maidan?retryWrites=true&w=majority
   CLIENT_URL=http://localhost:5173
   JWT_SECRET=super-secret-key-no-one-would-guess
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The API should be available at: `http://localhost:3000`

## Database Models

### User
| Field | Type | Rules |
| :--- | :--- | :--- |
| `username` | String | Required, unique, trimmed, lowercase |
| `hashedPassword` | String | Required |
| `isAdmin` | Boolean | Default: `false` |
| `followers` | Array of ObjectIds | Reference to `User` |
| `following` | Array of ObjectIds | Reference to `User` |
| `profilePicture` | String | Default picture URL |
| `bio` | String | Max length: 250 |
| `createdAt` | Date | Generated automatically |
| `updatedAt` | Date | Generated automatically |

### Venue
| Field | Type | Rules |
| :--- | :--- | :--- |
| `name` | String | Required |
| `description` | String | Max length: 500 |
| `location` | String | Required |
| `sportType` | Array of Strings | Required, enum: `["Football", "Padel", "Basketball", "Tennis", "Swimming"]` |
| `pricePerHour` | Number | Required |
| `images` | Array of Strings | Image URLs |
| `facilities` | Array of Strings | Facility list |
| `availability` | Array of Objects | `date` (Date), `slots` (Array of Strings) |
| `createdAt` | Date | Generated automatically |
| `updatedAt` | Date | Generated automatically |

### Booking
| Field | Type | Rules |
| :--- | :--- | :--- |
| `venue` | ObjectId | Required, reference to `Venue` |
| `owner` | ObjectId | Reference to `User` |
| `date` | Date | Date of booking |
| `timeSlots` | String | Required, time slot string |
| `status` | String | Enum: `['Confirmed', 'Cancelled']`, default: `'Confirmed'` |
| `teamName` | String | Trimmed |
| `opponentTeamName` | String | Trimmed |
| `matchRequestNote` | String | Trimmed |
| `invitedPlayers` | Array of ObjectIds | Reference to `User` |
| `teams` | Object | `teamA` (Array of User ObjectIds), `teamB` (Array of User ObjectIds) |
| `createdAt` | Date | Generated automatically |
| `updatedAt` | Date | Generated automatically |

### TeamChallenge
| Field | Type | Rules |
| :--- | :--- | :--- |
| `venueId` | ObjectId | Required, reference to `Venue` |
| `sportType` | String | Required |
| `date` | Date | Required |
| `timeSlot` | String | Required |
| `challengerTeam` | Object | `leaderId` (User ObjectId, Required), `teamName` (String, Required), `players` (Array of Strings) |
| `opponentTeam` | Object | `leaderId` (User ObjectId), `teamName` (String), `players` (Array of Strings) |
| `booking` | ObjectId | Reference to `Booking` |
| `status` | String | Enum: `['Looking for Opponent', 'Matched & Booked', 'completed']`, default: `'Looking for Opponent'` |
| `createdAt` | Date | Generated automatically |
| `updatedAt` | Date | Generated automatically |

### Notification
| Field | Type | Rules |
| :--- | :--- | :--- |
| `recipient` | ObjectId | Required, reference to `User` |
| `sender` | ObjectId | Required, reference to `User` |
| `type` | String | Required, enum: `['follow', 'invite']` |
| `booking` | ObjectId | Reference to `Booking` |
| `read` | Boolean | Default: `false` |
| `createdAt` | Date | Generated automatically |
| `updatedAt` | Date | Generated automatically |

## Entity Relationships
```
  +---------+           1:N           +---------+
  |  User   | <--------------------- | Booking |
  +---------+                         +---------+
       |                                   |
       | 1:N                               | N:1
       v                                   v
+--------------+                      +---------+
| Notification |                      |  Venue  |
+--------------+                      +---------+
       ^                                   ^
       |                                   |
       +---------- +---------------+ ------+
                   | TeamChallenge |
                   +---------------+
```

## API Base URL
- **Local development:** `http://localhost:3000`
- **Production:** `https://your-deployed-api.com`

## Endpoints

### Authentication (`/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/sign-up` | Public | Register a new user |
| `POST` | `/auth/sign-in` | Public | User login and receive JWT token |
| `GET` | `/auth/me` | Authenticated | Verify token and get active session |

### Venues (`/venues`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/venues` | Public | Get all venues (filter by sport and location) |
| `GET` | `/venues/:id` | Public | Get venue details by ID |
| `POST` | `/venues` | Admin | Create a venue with image upload |
| `PUT` | `/venues/:id` | Admin | Update venue details or photos |
| `DELETE` | `/venues/:id` | Admin | Delete a venue |

### Bookings (`/booking`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/booking/:id` | Authenticated | Create a venue booking |
| `GET` | `/booking/venue/:id` | Public | Get bookings for a venue |
| `GET` | `/booking/my-booking` | Authenticated | Get current user's bookings |
| `PUT` | `/booking/:id/edit` | Authenticated | Update booking / lineup |
| `POST` | `/booking/:id/invite` | Authenticated | Invite friend to booking |
| `GET` | `/booking/invitations/me` | Authenticated | Get pending match invitations |
| `POST` | `/booking/:id/join` | Authenticated | Join booking team roster |

### Team Challenges (`/challenges`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/challenges` | Public | Get all open match challenges |
| `POST` | `/challenges` | Authenticated | Create an open match challenge |
| `POST` | `/challenges/:id/accept` | Authenticated | Accept challenge and lock venue slot |

### User Profiles & Friends (`/profile`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/profile` | Authenticated | Get registered user profiles |
| `GET` | `/profile/me` | Authenticated | Get current user profile |
| `PUT` | `/profile/me` | Authenticated | Update profile & upload avatar |
| `GET` | `/profile/friends` | Authenticated | Get friends list |
| `GET` | `/profile/friends/search` | Authenticated | Search friends |
| `GET` | `/profile/followers` | Authenticated | Get followers |
| `GET` | `/profile/following` | Authenticated | Get following users |
| `GET` | `/profile/:id` | Authenticated | Get specific user profile |
| `POST` | `/profile/:id/follow` | Authenticated | Follow user |
| `POST` | `/profile/:id/unfollow` | Authenticated | Unfollow user |

### Notifications (`/notifications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/notifications` | Authenticated | Get user notifications |
| `PUT` | `/notifications/:id/read` | Authenticated | Mark notification as read |

### Admin (`/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/users` | Admin | Get all users |
| `DELETE` | `/admin/users/:id` | Admin | Delete a user |
| `PATCH` | `/admin/users/:id/role` | Admin | Update user role |
| `GET` | `/admin/venues` | Admin | Get all venues |
| `GET` | `/admin/bookings` | Admin | Get all platform bookings |
| `DELETE` | `/admin/bookings/:id` | Admin | Delete any booking |

## Status Codes
| Status | Meaning in this API |
| :--- | :--- |
| `200` | Successful request |
| `201` | Resource created |
| `204` | Successful deletion with no body |
| `400` | Invalid request |
| `401` | Authentication required or invalid |
| `403` | Authenticated but not permitted |
| `404` | Resource not found |
| `409` | Resource conflict |
| `429` | Too many requests |
| `500` | Unexpected server error |

## Testing
Run tests:
```bash
npm test
```
Tests use Jest and Supertest against API endpoints.

## Future Enhancements
- WebSockets for real-time match invitation notifications.
- Payment gateway integration (Stripe / BenefitPay).
- Weather forecasting integration for outdoor venue bookings.

## Team Members
| Name | GitHub |
| :--- | :--- |
| Ali Alsaeed | [GitHub Profile](https://github.com/ALIALSAEED313) |
| Sadeq Ali | [GitHub Profile](https://github.com/Sadeq-J) |
| Faisal Raheem | [GitHub Profile](https://github.com/faisalr305) |

## Credits
- Ali Alsaeed, Sadiq Ali , Faisal Raheem
