# Library Review Frontend

## Overview

This project is the frontend part of my application called Bookpal Reviews. It allows users to browse books, view book details, read reviews, and see the latest reviews submitted by users.

The application is built using React and react states and components, and communicates with a Node.js/Express backend that provides review and user data and integrates with the Google Books API.

Link to backend repository: (https://github.com/Rosalij/librarybackend.git)

---

## Features

### Book Browsing

Users can view information about books retrieved from the backend, which fetches data from the Google Books API.

### Latest Reviews

The homepage displays the most recent reviews submitted by users, including:

* Book title
* Book cover image
* Reviewer username
* Star rating
* Review text

### Book Pages

Each book has a dedicated page where users can view additional information and associated reviews.

### User Navigation

Users can click on reviewer names to navigate to user profile pages, or search for and follow / unfollow other users for quick navigation to look at other peoples reviews.

### Profile

Visitors can register as users to create reviews and log in show and edit their own review history and follow other users.
---

## Technologies Used

* React
* TypeScript
* React-router-dom
* Vite
* Fetch API
* CSS

---
## Installation

Clone the repository and install dependencies.

---

## Running the Application

Start the development server.

```
npm run dev
```

The application will run on:

```
http://localhost:5173
```

---

## Backend API

This frontend communicates with the backend API for retrieving reviews and book information.

Example endpoints:

Latest reviews:

```
GET /api/reviews/latest
```

Fetch book details:

```
GET /api/books/:bookId
```

---

## Environment Configuration

The backend API base URL is used for fetching data.

```
https://librarybackend-c0p9.onrender.com
```




# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
