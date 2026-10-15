# Abhimanyu Vashisht – Portfolio

Modern portfolio website built with Next.js, TypeScript, Tailwind CSS, and Redux Toolkit.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **Deployment:** GitHub Pages (Static Export)
- **Icons:** Font Awesome 6

## 📦 Features

- ✨ Modern component-based architecture
- 🎨 Tailwind CSS for utility-first styling
- 🌗 Dark mode support with Redux state management
- 📱 Fully responsive design
- ♿ Accessibility best practices
- 🚀 Optimized static exports for GitHub Pages
- 🔄 Client-side routing with Next.js App Router

## 🛠️ Development

### Prerequisites

- Node.js 20+ and npm

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view in your browser.

### Build for Production

```bash
npm run build
```

This generates a static export in the `out/` directory ready for deployment.

## 🌐 Deployment

The site automatically deploys to GitHub Pages when you push to the `master` branch.

The GitHub Actions workflow:
1. Installs dependencies
2. Builds the Next.js app with static export
3. Deploys the `out/` directory to GitHub Pages

## 📂 Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── layout.tsx    # Root layout with providers
│   ├── page.tsx      # Home page
│   ├── about/        # About page
│   ├── work/         # Work page
│   ├── contact/      # Contact page
│   └── not-found.tsx # 404 page
├── components/       # Reusable React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ProfileVisual.tsx
├── store/            # Redux Toolkit store
│   ├── store.ts
│   ├── themeSlice.ts
│   ├── hooks.ts
│   └── ReduxProvider.tsx
└── styles/           # Global styles
    └── globals.css
```

## 🎯 Key Improvements

### From Previous Version:
- ❌ Manual HTML duplication → ✅ Component-based architecture
- ❌ Vanilla routing → ✅ Next.js App Router
- ❌ Global theme variables → ✅ Redux state management
- ❌ Inline styles → ✅ Tailwind utility classes
- ❌ Build script hacks → ✅ Native Next.js static export

## 📄 License

© 2026 Abhimanyu Vashisht. All rights reserved.
