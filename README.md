# 🔐 Secret Box

A modern, secure authentication and user management application built with Next.js 15, TypeScript, and Redux Toolkit.

## ✨ Features

### 🔐 Complete Authentication System
- **User Registration** with comprehensive form validation
- **Email Verification** with OTP (One-Time Password)
- **Secure Login** with password strength requirements
- **Password Reset Flow** with email verification
- **Guest Access** for quick exploration
- **Google OAuth Integration** (ready for implementation)

### 🎨 Modern UI/UX
- **Responsive Design** optimized for all devices
- **Dark/Light/System Theme** support with persistence
- **Real-time Form Validation** with helpful error messages
- **Password Strength Indicator** with security requirements
- **Accessible Components** with ARIA labels and keyboard navigation
- **Loading States** and smooth transitions throughout

### 🛡️ Security Features
- **Password Requirements**: Minimum 8 characters, 2 uppercase letters, 2 special characters, no spaces
- **OTP Verification** for email confirmation and password reset
- **Session Management** with Redux Persist
- **Error Boundaries** for graceful error handling
- **Input Sanitization** and validation

### 🏗️ Technical Architecture
- **Next.js 15** with App Router for optimal performance
- **TypeScript** for type safety and better developer experience
- **Redux Toolkit** with RTK Query for state management and API calls
- **Tailwind CSS v4** with custom design system
- **Shadcn/ui Components** built on Radix UI primitives
- **Framer Motion** ready for animations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd secret-box
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication pages
│   │   ├── signin/              # Sign in page
│   │   ├── signup/              # Sign up page
│   │   ├── confirm-email/       # Email verification
│   │   ├── forget-password/     # Password reset request
│   │   │   └── otp/            # Password reset OTP
│   │   └── reset-password/      # New password setup
│   ├── (dashboard)/             # Protected dashboard pages
│   │   ├── profile/[id]/        # User profile pages
│   │   └── search/              # Search functionality
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page (redirects to signup)
│   └── globals.css              # Global styles and CSS variables
├── components/
│   ├── auth/                    # Authentication components
│   │   ├── OTPInput.tsx         # 6-digit OTP input component
│   │   ├── PasswordInput.tsx    # Password field with visibility toggle
│   │   └── PasswordStrengthIndicator.tsx # Password validation UI
│   ├── theme/                   # Theme management
│   │   ├── ThemeProvider.tsx    # Theme context provider
│   │   └── ThemeToggle.tsx      # Theme switcher component
│   ├── ui/                      # Reusable UI components (Shadcn/ui)
│   └── error-boundary/          # Error handling components
├── store/                       # Redux store configuration
│   ├── api/                     # RTK Query API definitions
│   │   └── apiSlice.ts          # Authentication API endpoints
│   ├── slices/                  # Redux slices
│   │   ├── authSlice.ts         # Authentication state
│   │   └── themeSlice.ts        # Theme state
│   ├── providers/               # Redux providers
│   │   └── ReduxProvider.tsx    # Redux store provider
│   ├── hooks.ts                 # Typed Redux hooks
│   └── index.ts                 # Store configuration
├── types/                       # TypeScript type definitions
│   └── types.ts                 # Application types
├── lib/                         # Utility functions
│   └── utils.ts                 # Common utilities
└── hooks/                       # Custom React hooks
    └── useApiError.ts           # API error handling hook
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## 🎨 Customization

### Theme Configuration
The application uses a custom design system with CSS variables. You can customize colors, spacing, and other design tokens in `src/app/globals.css`.

### Component Styling
Components use Tailwind CSS with the `cn()` utility function for conditional styling. The design system supports both light and dark themes automatically.

### API Integration
Update the API endpoints in `src/store/api/apiSlice.ts` to connect with your backend:

```typescript
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  // ... other configuration
});
```

## 🔌 API Endpoints

The application expects the following API endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Password Management
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/verify-reset-code` - Verify reset OTP
- `POST /auth/reset-password` - Update password

### Email Verification
- `POST /auth/resend-verification` - Resend verification email
- `POST /auth/verify-email` - Verify email with token

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives
- [Lucide React](https://lucide.dev/) - Icons
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications

## 📞 Support

If you have any questions or need help, please:
1. Check the [documentation](docs/)
2. Search [existing issues](issues/)
3. Create a [new issue](issues/new)

---

Made with ❤️ by the Secret Box team
