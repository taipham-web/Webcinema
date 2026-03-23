# 🎬 CinemaWeb - Website Xem Phim

## 📁 Cấu Trúc Dự Án

```
CinemaWeb/
├── client/                    # Frontend (React)
│   ├── public/               # File tĩnh
│   └── src/
│       ├── assets/           # Hình ảnh, icons
│       ├── components/       # Các component React
│       │   ├── common/      # Component dùng chung (Button, Input, Card...)
│       │   ├── layout/      # Layout components (Header, Footer, Sidebar...)
│       │   └── movie/       # Component liên quan đến phim
│       ├── context/         # React Context (Auth, Theme...)
│       ├── hooks/           # Custom hooks
│       ├── pages/           # Các trang chính (Home, MovieDetail, Profile...)
│       ├── services/        # API calls
│       ├── styles/          # CSS/SCSS files
│       ├── utils/           # Helper functions
│       ├── App.js           # Main app component
│       └── index.js         # Entry point
│
├── server/                   # Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/          # Cấu hình (database, env...)
│   │   ├── controllers/     # Controllers xử lý logic
│   │   ├── middleware/      # Middleware (auth, validation...)
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   ├── validators/      # Input validation
│   │   └── server.js        # Entry point
│   └── uploads/             # Uploaded files
│
├── database/                 # Database scripts/migrations
├── docs/                     # Documentation
├── .gitignore
└── README.md
```

## 🚀 Bắt Đầu

### Client

```bash
cd client
npm install
npm start
```

### Server

```bash
cd server
npm install
npm run dev
```

## 📝 Tính Năng

- 🎥 Danh sách phim
- 🔍 Tìm kiếm phim
- 📺 Xem phim online
- 👤 Quản lý tài khoản
- ⭐ Đánh giá & bình luận
- 📱 Responsive design

## 🛠️ Công Nghệ

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB/MySQL
- **Authentication**: JWT
