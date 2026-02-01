# EduLearnix - Complete Career Platform for Freshers

A comprehensive MERN stack platform providing jobs, resources, courses, blogs, mock tests, and digital products for freshers and students.

## 🚀 Features

- **Job Portal**: Browse and search fresher jobs across India
- **Free Resources**: Access study materials and career resources
- **Tech Blog**: Read articles about technology and career development
- **Digital Products**: Purchase courses and career development tools
- **Mock Tests**: Practice aptitude and technical assessments
- **Courses**: Explore online courses and certifications
- **Points & Rewards**: Earn points by contributing content

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt.js

## 📦 Project Structure

```
edulearnix/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & error middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── server.js        # Express server
│   ├── .env             # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── context/     # React context (Auth, Theme)
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── App.jsx      # Main app component
    │   └── main.jsx     # Entry point
    ├── public/          # Static assets
    ├── .env             # Environment variables
    └── package.json
```

## 🔧 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update with your MongoDB URI and other settings

4. Seed super admin (first time only):
```bash
npm run seed
```

5. Start development server:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update `VITE_API_URL` to point to backend

4. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🌐 Production Deployment

### Backend Deployment (Render)

See [backend/RENDER_DEPLOYMENT.md](backend/RENDER_DEPLOYMENT.md) for detailed instructions.

**Quick Steps:**
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set root directory to `backend`
5. Add environment variables
6. Deploy

### Frontend Deployment (Netlify)

See [frontend/NETLIFY_DEPLOYMENT.md](frontend/NETLIFY_DEPLOYMENT.md) for detailed instructions.

**Quick Steps:**
1. Push code to GitHub
2. Create new site on Netlify
3. Connect GitHub repository
4. Set base directory to `frontend`
5. Set build command: `npm run build`
6. Set publish directory: `dist`
7. Add environment variable: `VITE_API_URL`
8. Deploy

## 🔐 Environment Variables

### Backend (.env)
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.netlify.app
SUPER_ADMIN_NAME=Md Mijanur Molla
SUPER_ADMIN_EMAIL=mdmijanur.molla@edulearnix.com
SUPER_ADMIN_PASSWORD=your_secure_password
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-domain.onrender.com/api
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Auth required)
- `PUT /api/jobs/:id` - Update job (Auth required)
- `DELETE /api/jobs/:id` - Delete job (Auth required)

### Resources
- `GET /api/resources` - Get all resources
- `POST /api/resources` - Create resource (Auth required)

### Blogs
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create blog (Auth required)

### Products
- `GET /api/products` - Get all digital products

### Courses
- `GET /api/courses` - Get all courses

### Mock Tests
- `GET /api/mocktests` - Get all mock tests

### Claims
- `GET /api/claims` - Get reward claims (Admin)
- `POST /api/claims` - Submit claim (Auth required)

## 👥 User Roles

- **super_admin**: Full platform access, verified badge
- **job_poster**: Can post jobs
- **resource_poster**: Can post resources
- **blog_poster**: Can write blogs
- **digital_product_poster**: Can add products
- **others**: Regular users

## 🎯 Points System

Users earn 1 point for each contribution:
- Post a job: +1 point
- Post a resource: +1 point
- Write a blog: +1 point

**Conversion**: 10 points = ₹10

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Developer

**Md Mijanur Molla**
- Email: mdmijanur.molla@edulearnix.com
- Role: Founder & Community Admin

## 🆘 Support

For support, email mdmijanur.molla@edulearnix.com

---

Made with ❤️ for freshers and students across India
