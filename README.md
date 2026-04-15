# 📚 Komik - Anime & Manga Platform

A professional web application for browsing anime and manga content from multiple sources, built with Next.js and Tailwind CSS.

## 🚀 Features

- **Multi-Source Support**: Browse from Komiku, Komikcast, and Anoboy
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Fast Search**: Search manga across different sources
- **Pagination Support**: Navigate through pages of results
- **Detailed Pages**: View detailed information about manga/anime
- **Server-Side Rendering**: Optimized performance with Next.js App Router

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Runtime**: Node.js 16+
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 16 or higher
- npm (comes with Node.js)
- Running Weebs Scraper API on `http://localhost:3000`

## 🔧 Setup & Installation

### 1. Extract/Navigate to Project

```bash
cd komik
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

> **Note**: Make sure the Weebs Scraper API is running on port 3000 before starting this application.

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
komik/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx              # Home page
│   │   ├── search/
│   │   │   └── page.tsx          # Search results page
│   │   └── detail/[param]/
│   │       └── page.tsx          # Manga detail page
│   ├── components/               # Reusable React components
│   │   ├── Header.tsx            # Header with search bar
│   │   ├── MangaCard.tsx         # Manga card component
│   │   └── Pagination.tsx        # Pagination controls
│   └── lib/
│       └── api.ts                # API client & types
├── .env.local                    # Environment variables
├── package.json                  # Project dependencies
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## 🌐 Supported Sources

### 1. **Komiku** (Default)
Latest and popular manga with descriptions and chapters

### 2. **Komikcast**
Alternative manga source with ratings

### 3. **Anoboy**
Anime streaming source (if API is available)

## 📖 Available Pages

### Home Page (`/`)
- Shows latest manga from selected source
- Switch between Komiku and Komikcast
- Pagination controls

### Search Page (`/search?q=<query>&source=<source>`)
- Search manga by title
- Filter by source
- Pagination through results

### Detail Page (`/detail/<param>?source=<source>`)
- Full manga information
- Description, genre, author, status
- Latest chapter information
- Chapter list (when available)

## 🔌 API Integration

This application connects to the **Weebs Scraper API** running on `http://localhost:3000`

### Available Endpoints

```
GET /api/komiku                          # Latest manga
GET /api/komiku?s=<query>&page=<page>   # Search manga
GET /api/komiku/<param>                  # Manga detail

GET /api/komikcast                       # Latest manga
GET /api/komikcast?s=<query>&page=<page> # Search manga  
GET /api/komikcast/<param>               # Manga detail

GET /api/anoboy                          # Latest anime
GET /api/anoboy?s=<query>&page=<page>   # Search anime
GET /api/anoboy/<param>                  # Anime detail
```

## ⚙️ Configuration

### Tailwind CSS
Customization in `tailwind.config.ts`

### TypeScript
Settings in `tsconfig.json`

### Next.js
Settings in `next.config.ts`

## 🚨 Troubleshooting

### API Connection Error
**Problem**: "Gagal memuat data" message

**Solution**: 
1. Ensure Weebs Scraper API is running on `http://localhost:3000`
2. Check `.env.local` has correct URL
3. Restart the application

### Port Already in Use
**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution** (Windows):
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Build Errors

```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

### Deploy to Netlify

Build and deploy `.next` folder

**Important**: Update `NEXT_PUBLIC_API_URL` to production API

## 📝 Development Tips

- Hot Reload: Auto-reload on file changes
- TypeScript: Full type safety
- Tailwind CSS: Utility-first CSS
- Server Components: Async data fetching

## 📄 License

ISC License

---

Built with ❤️ using Next.js and Tailwind CSS
