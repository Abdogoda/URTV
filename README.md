# URTV - Movie & TV Show Database App

A modern, responsive React application for browsing movies and TV shows using the TMDB (The Movie Database) API. Built with React Router, Axios, Framer Motion for animations, and responsive CSS.

## 🎬 Features

- **Home Page**: Featured content showcase with multiple carousels for different categories
- **Movie/TV Show Details**: Comprehensive information pages with trailers, cast, and ratings
- **Search Functionality**: Multi-search supporting movies, shows, and TV series
- **Responsive Design**: Fully responsive for desktop, tablet, and mobile devices
- **Dark Theme**: Professional dark mode with red accents (#c41e3a)
- **Smooth Animations**: Hover effects and transitions using Framer Motion
- **Lazy Loading**: Images with lazy loading for better performance

## 📦 Project Structure

```
src/
├── components/
│   ├── Header.jsx              # Navigation header with search
│   ├── MovieCard.jsx           # Reusable movie/show card component
│   ├── Carousel.jsx            # Horizontally scrollable carousel
│   ├── TrailerPlayer.jsx       # YouTube trailer embed component
│   ├── LoadingSpinner.jsx      # Loading state component
│   └── ErrorMessage.jsx        # Error state component
├── pages/
│   ├── Home.jsx                # Home page with featured and carousels
│   ├── MovieDetails.jsx        # Movie details page
│   ├── TVShowDetails.jsx       # TV show details page with seasons
│   └── SearchResults.jsx       # Search results grid
├── services/
│   └── api.js                  # TMDB API configuration and requests
├── App.jsx                     # Main app with routing
└── index.css                   # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:

```bash
npm install
```

2. **Start development server**:

```bash
npm run dev
```

3. **Open in browser**:
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

### Build for Production

```bash
npm run build
```

## 🔧 Technologies Used

- **React 18**: Modern functional components with hooks
- **React Router v6**: Client-side navigation
- **Axios**: HTTP client for API requests
- **Framer Motion**: Animations and transitions
- **Vite**: Fast build tool and dev server
- **CSS3**: Grid, Flexbox, and animations
- **TMDB API**: Movie and TV show data

## 📡 API Integration

The app uses the TMDB API with the following endpoints:

- `GET /movie/popular` - Popular movies
- `GET /movie/upcoming` - Upcoming movies
- `GET /movie/top_rated` - Top-rated movies
- `GET /tv/popular` - Popular TV shows
- `GET /tv/top_rated` - Top-rated TV shows
- `GET /search/multi` - Multi-type search

**API Key**: a32eccaa3dcf029ec1662249d4b44c73

## 🎨 Design & Styling

- **Dark Theme**: Background #0d0d0d, accent color #c41e3a
- **Responsive**: Mobile-first responsive design
- **Animations**: Smooth transitions and hover effects
- **Grid Layout**: CSS Grid for flexible layouts

## 📄 Pages & Routes

| Route             | Component     | Description                    |
| ----------------- | ------------- | ------------------------------ |
| `/`               | Home          | Featured content and carousels |
| `/movie/:id`      | MovieDetails  | Movie information and trailer  |
| `/tv/:id`         | TVShowDetails | Show details with seasons      |
| `/search?q=query` | SearchResults | Search results grid            |

## 🎯 Key Components

- **Header**: Navigation with search functionality
- **MovieCard**: Reusable card with poster, title, rating
- **Carousel**: Scrollable content container
- **TrailerPlayer**: YouTube trailer embed
- **LoadingSpinner**: Loading state UI
- **ErrorMessage**: Error handling UI

## 🔍 Search Feature

Supports searching for movies, TV shows, and actors with results displayed in a responsive grid.

## 📱 Responsive Breakpoints

- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: Below 768px

## 🎬 Features Included

- Featured content showcase
- Category carousels (Popular, Upcoming, Top Rated, etc.)
- Movie/show details with cast and crew
- TV show seasons and episodes
- Trailer player with YouTube embed
- Search across movies, shows, and people
- Ratings and vote counts
- Production companies
- Director/Creator information
- Budget and revenue info (for movies)

## 📦 Dependencies

- react@^18
- react-router-dom@^6
- axios
- framer-motion

## 🚀 Quick Start

```bash
# Install and start
npm install
npm run dev

# Visit http://localhost:5173
```

## 📝 Environment

The app uses hardcoded TMDB API credentials. For production, consider:

- Moving API key to environment variables
- Implementing a backend proxy for API calls
- Adding authentication

## 🌐 Browser Support

- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

**Built with React, Vite, and TMDB API**
