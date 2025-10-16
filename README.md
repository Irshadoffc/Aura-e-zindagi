# Aura E-Zindagi

A full-stack web application built with Laravel backend and React frontend.

## 🚀 Tech Stack

### Backend
- **Laravel 12** - PHP Framework
- **PHP 8.2+** - Server-side language
- **MySQL/SQLite** - Database

### Frontend
- **React 19** - Frontend framework
- **Vite** - Build tool
- **TailwindCSS 4** - Styling
- **Firebase** - Authentication & services
- **Framer Motion** - Animations
- **React Router** - Navigation

## 📋 Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- MySQL (or SQLite for development)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Aura-e-zindagi
```

### 2. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Development Mode
```bash
# Backend (from backend directory)
php artisan serve

# Frontend (from frontend directory)
npm run dev
```

### Production Build
```bash
# Frontend
npm run build

# Backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 📁 Project Structure

```
Aura-e-zindagi/
├── backend/          # Laravel API
│   ├── app/         # Application logic
│   ├── config/      # Configuration files
│   ├── database/    # Migrations & seeders
│   └── routes/      # API routes
└── frontend/        # React application
    ├── src/         # Source code
    ├── public/      # Static assets
    └── dist/        # Build output
```

## 🔧 Environment Variables

### Backend (.env)
```env
APP_NAME="Aura E-Zindagi"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=aura_e_zindagi
DB_USERNAME=root
DB_PASSWORD=
```

### Frontend
Configure Firebase and API endpoints in your environment files.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.