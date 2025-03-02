# 🚀 Next Blog - Multi-Tenant Blogging Platform

A modern, full-stack blogging platform built with **Next.js**, **Prisma**, **PostgreSQL**, and **TypeScript**. This platform allows users to create and manage multiple blogs, each with its own custom subdomain (e.g., `mysite.frostcore.tech`). Perfect for developers, content creators, and businesses looking to manage multiple blogs under one roof.

---

## 🔥 Techstack

[<img src="https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js&logoColor=white&labelColor=black&color=black&borderRadius=20" height="30">](https://nextjs.org/)
[<img src="https://img.shields.io/badge/TypeScript-5.8-blue?style=flat&logo=typescript&logoColor=white&labelColor=blue&color=blue&borderRadius=20" height="30">](https://www.typescriptlang.org/)
[<img src="https://img.shields.io/badge/Prisma-6.4-2D3748?style=flat&logo=prisma&logoColor=white&labelColor=2D3748&color=2D3748&borderRadius=20" height="30" />](https://www.prisma.io/)
[<img src="https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?style=flat&logo=tailwind-css&logoColor=white&labelColor=38B2AC&color=38B2AC&borderRadius=20" alt="TailwindCSS" height="30" />](https://tailwindcss.com/)
[<img src="https://img.shields.io/badge/PostgreSQL-15-316192?style=flat&logo=postgresql&logoColor=white&labelColor=316192&color=316192&borderRadius=20" height=30>](https://www.postgresql.org/)
[<img src="https://github.com/vquix/svg-badges/blob/main/NextAuth%20V5.0-081b26.svg" height=30>](https://next-auth.js.org/)

---

## ✨ Features

### 🏢 **Multi-Tenant Architecture**

- Create and manage multiple blogs under one account.
- Each blog gets a unique subdomain (e.g., `mysite.frostcore.tech`).
- Isolated content and settings for each blog.

### 🔐 **Authentication & Authorization**

- Secure authentication with **NextAuth.js**.
- Supports email/password, Google, and GitHub login.
- Role-based access control for managing blogs and posts.

### 📝 **Blog Management**

- Create, edit, and publish blog posts with a rich text editor.
- Save drafts and schedule posts for later.
- Manage multiple blogs from a single dashboard.

### 🎨 **Modern UI/UX**

- Built with **Tailwind CSS** and **shadcn/ui** for a sleek, responsive design.
- Dark/Light mode support.
- Customizable themes and components.

### 🛠️ **Technical Features**

- **Next.js** for server-side rendering and API routes.
- **Prisma** for database management and migrations.
- **PostgreSQL** as the primary database.
- **TypeScript** for type-safe development.
- **Turbopack** for faster builds and development.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **PostgreSQL** (running locally or remotely)
- **pnpm** (recommended package manager)

### Installation

1. Fork & Clone the repository:

   ```bash
   git clone https://github.com/your-username/next-blog.git
   cd next-blog
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up your environment variables:
   Create a `.env.local` file in the root directory and add the following:

   ```env
    DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name?schema=public"
    GOOGLE_CLIENT_ID="your_google_client_id"
    GOOGLE_CLIENT_SECRET="your_google_client_secret"
    GITHUB_CLIENT_ID="your_github_client_id"
    GITHUB_CLIENT_SECRET="your_github_client_secret"
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your_nextauth_secret"

    RESEND_API_KEY="your_resend_api_key"
    # EMAIL_SERVER_PASSWORD="your_resend_api_key" same as RESEND_API_KEY
    EMAIL_SERVER_USER=resend
    EMAIL_SERVER_HOST=smtp.resend.com
    EMAIL_SERVER_PORT=465
    EMAIL_FROM=onboarding@resend.dev

    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="run: npx auth secret or run: openssl rand -base64 32"

    BASE_DOMAIN="localhost:3000" # for development
    # BASE_DOMAIN="your_domain.com" # for production
    PROTOCOL="http://" # for development
    # PROTOCOL="https://" # for production
   ```

4. Run database migrations:

   ```bash
   pnpm prisma migrate dev --name init
   ```

5. Seed the database (optional):

   ```bash
   pnpm seed
   ```

6. Start the development server:

   ```bash
   pnpm dev
   ```

7. Open your browser and navigate to `http://localhost:3000`.

---

## 🛠️ Scripts

- **`pnpm dev`**: Start the development server with Turbopack.
- **`pnpm build`**: Generate Prisma client and build the project.
- **`pnpm start`**: Start the production server.
- **`pnpm lint`**: Run ESLint to check for code issues.
- **`pnpm prisma studio`**: Open Prisma Studio to visualize and edit the database.
- **`pnpm prisma generate`**: Generate the Prisma client.
- **`pnpm prisma db push`**: Push the Prisma schema state to the database.

---

## 🧩 Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Server Actions
- **Database & Authentication**: PrismaORM, PostgreSQL, NextAuth
- **Utilities**: Zod (validation), UUID (unique IDs), Resend (email)

---

## 📂 Project Structure

```
next-blog/
├── app/                  # Next.js app router
│   └── ...
├── components/           # Reusable UI components
├── components.json       # Components configuration
├── lib/                  # Utility functions
├── middleware.ts         # Middleware configuration
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
├── README.md             # Project README file
├── styles/               # Global styles
│   └── ...
├── .env                  # Environment variables
├── .env.example          # Example env
├── .gitignore            # Git ignore file
├── next.config.ts        # Next.js configuration
├── next-env.d.ts         # Next.js environment types
├── tsconfig.json         # TypeScript configuration
├── eslint.config.mjs     # ESLint configuration
├── postcss.config.mjs    # PostCSS configuration
├── package.json          # Project dependencies
├── pnpm-lock.yaml        # pnpm lock file
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Keep blogging! 🎉
