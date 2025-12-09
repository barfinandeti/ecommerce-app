# LUXE | Timeless Elegance

![LUXE Banner](https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200&h=400)

## Overview

**LUXE** is a premium e-commerce platform designed to deliver a sophisticated shopping experience for high-end fashion and lifestyle products. Built with modern web technologies, it combines aesthetic excellence with robust performance to serve discerning customers.

## ✨ Key Features

-   **Premium User Interface**: A visually stunning, responsive design featuring glassmorphism, smooth animations, and a curated color palette.
-   **Seamless Authentication**: Secure passwordless login via OTP (One-Time Password) powered by Supabase.
-   **Advanced Product Discovery**:
    -   Dynamic filtering and sorting (Price, Origin, Size, Popularity).
    -   Hierarchical category navigation.
    -   Real-time search functionality.
-   **Shopping Experience**:
    -   Interactive shopping cart and wishlist management.
    -   Product customization options.
    -   Streamlined checkout process.
-   **Role-Based Access Control (RBAC)**:
    -   **User**: Browse, shop, manage profile and orders.
    -   **Admin**: Manage products, orders, and categories.
    -   **Superadmin**: Full system control, including organization and user management.
-   **Admin Dashboard**: Comprehensive analytics and management tools for store administrators.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Pages Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Prisma ORM](https://www.prisma.io/))
-   **Authentication**: [Supabase Auth](https://supabase.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **State Management**: React Context API

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   PostgreSQL Database
-   Supabase Project

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/barfinandeti/ecommerce-app.git
    cd ecommerce-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and configure your environment variables:
    ```env
    DATABASE_URL="postgresql://..."
    NEXT_PUBLIC_SUPABASE_URL="https://..."
    NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
    ```

4.  **Database Migration**
    ```bash
    npx prisma migrate dev
    ```

5.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
