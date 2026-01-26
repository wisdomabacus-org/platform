🧮 Wisdom Abacus Academy - Online Exam Portal

A modern, fast, and responsive online examination platform built with Vite + React + TypeScript + Tailwind CSS.

This portal is designed for hosting mock tests and competition exams under the subdomain:
👉 https://exam.wisdomabacus.com

🚀 Features

🎯 Real-time online mock test interface

📄 Exam start, live exam, and scorecard pages

🧠 Clean and distraction-free layout

⚡ Built with Vite for lightning-fast performance

🎨 Styled using Tailwind CSS

🧩 Fully modular and scalable React component structure

🧰 Tech Stack
Tool	Purpose
Vite
	Frontend build tool
React
	UI library
TypeScript
	Static typing
Tailwind CSS
	Utility-first CSS framework
🛠️ Local Development Setup

Make sure you have Node.js (>=18) and pnpm / npm / yarn installed.

1️⃣ Clone the Repository
git clone <YOUR_GIT_URL>
cd exam-portal

2️⃣ Install Dependencies
pnpm install


(You can also use npm install or yarn install if preferred.)

3️⃣ Start Development Server
pnpm dev


Then visit:
👉 http://localhost:5173

🏗️ Build for Production

To generate a production-ready build:

pnpm build


Output will be created inside the /dist directory.

To preview the build locally:

pnpm preview

📦 Deployment

You can deploy the built app to:

Vercel

Netlify

GitHub Pages

Custom hosting (e.g., subdomain: exam.wisdomabacus.com)

Simply upload the contents of /dist to your hosting provider.

📁 Folder Structure
.
├── public/           # Static assets
├── src/              # React + TypeScript source
│   ├── components/   # Reusable UI components
│   ├── pages/        # Exam, Result, Thank You pages
│   ├── hooks/        # Custom hooks
│   ├── main.tsx      # Entry point
│   └── index.css     # Global styles
├── index.html        # App HTML entry
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json

🧑‍💻 Author

Wisdom Abacus Academy
📧 info@wisdomabacus.com

🌐 https://wisdomabacus.com