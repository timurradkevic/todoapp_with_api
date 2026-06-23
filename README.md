# TODO App

A modern, production-ready Todo application built with React, TypeScript, and structured according to the Feature-Sliced Design (FSD) architectural methodology. It features full CRUD operations synchronized with an external REST API.

## Live Preview

[DEMO Link](https://timurradkevic.github.io/todoapp_with_api/)

## Technologies Used

* **React 18** — Functional components, Hooks API (`useCallback`, `useEffect`, `useRef`, `useState`)
* **TypeScript** — Strict type safety across features, types, and API payloads
* **Feature-Sliced Design (FSD)** — Advanced architectural pattern for scalable and maintainable frontend applications
* **SCSS / BEM** — Modular styling with block-element-modifier naming convention
* **Bulma CSS** — Lightweight, modern CSS framework for standard UI components and notifications
* **Fetch API** — Custom encapsulated HTTP client with automated delay for smooth loader transitions

## Getting Started

### 1. Clone the repository

git clone https://github.com/your-username/todoapp_with_api/
cd todoapp_with_api

### 2. Install dependencies

npm install
# or
yarn install

### 3. Set up your User ID

Open `src/features/todos/api/todos.ts` and update the `USER_ID` constant with your personal ID obtained from the registration page:

const USER_ID = 4196; // Replace with your actual ID

### 4. Run the project locally

npm run dev
# or
npm start

Open http://localhost:3000 in your browser.

## Features

* **Full CRUD Synchronization** — Add, read, update, and delete todos in real time with an external server.
* **Advanced State Management (`useTodos`)** — Completely isolated business logic via a custom hook, separating UI presentation from state side-effects.
* **Optimistic UI / Temp Todo Loading** — Instantly displays a semi-transparent "temporary" todo item with a loading spinner while the server processes the creation request.
* **Asynchronous Action Blockers** — Individual items and inputs display skeleton loaders and become disabled while active network mutations are in progress.
* **Client-Side Filtering** — Quick toggle between `All`, `Active`, and `Completed` tasks using enum-driven routing states.
* **Bulk Operations** — Toggle the status of all existing todos at once or clear all completed tasks with a single action.
* **Inline Editing** — Double-click a todo item to edit its title with full focus management, automatic saving on blur, or cancellation on pressing `Escape`.
* **Auto-Dismissing Notifications** — Informative error messages pop up if a network operation fails, automatically hiding after 3 seconds.
