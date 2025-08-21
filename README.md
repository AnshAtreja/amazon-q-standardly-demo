# Standardly - Document Analysis & Standardization

A secure Next.js application for document analysis and standardization.

## Features

- 🔐 Secure JWT-based authentication
- 🎨 Modern UI with Tailwind CSS
- 🛡️ Security best practices implemented
- 📱 Responsive design
- 🔒 Protected routes with middleware

## Demo Credentials

- **Email**: admin@standardly.com
- **Password**: demo123

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Update the `.env.local` file with your configuration

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Security Features

- JWT tokens with secure HTTP-only cookies
- Password hashing with bcrypt
- CSRF protection with SameSite cookies
- Environment variable configuration
- Route protection middleware
- Input validation and sanitization

## Project Structure

```
src/
├── app/
│   ├── api/auth/          # Authentication API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   └── page.tsx          # Home page (redirects to login)
├── lib/
│   └── auth.ts           # Authentication utilities
└── middleware.ts         # Route protection middleware
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DEMO_EMAIL=admin@standardly.com
DEMO_PASSWORD=demo123
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production
```

## Technologies Used

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- JWT (jose library)
- bcryptjs for password hashing
- Lucide React for icons