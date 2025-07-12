# 🎬 myFlix-Angular-client

Hi there! 👋  
This is the **Angular frontend** for my movie database project, `myFlix`. It's a single-page application (SPA) that allows users to browse a collection of movies, manage their favourites, and update their profile — all connected to a custom-built REST API I developed.

This client was built as part of my learning journey with Angular, and it demonstrates the core concepts of component-driven development, Angular Material design, and integration with external APIs.

---

## 💡 What It Does

- ✅ Register new users
- ✅ Authenticate existing users
- ✅ Browse all movies in the catalogue
- ✅ View genre & director info
- ✅ Add/remove favourites
- ✅ Update or delete your profile

Everything is powered by Angular + TypeScript on the frontend and communicates with a Node.js/Express backend connected to MongoDB.

---

## 🧰 Tech Stack

**Frontend:**

- Angular
- Angular Material
- RxJS
- TypeScript
- SCSS

**Backend (external):**

- Node.js / Express
- MongoDB / Mongoose
- JWT Authentication

You can find the backend repo here 👉 [movie_api](https://github.com/darunbjork/movie_api)

---

## 🧑‍💻 How to Run It Locally

If you’d like to run this project on your machine, follow these steps:

### Prerequisites

- Node.js v16+ or v18+
- Angular CLI

### Clone & Install

git clone https://github.com/darunbjork/myFlix-Angular-client.git
cd myFlix-Angular-client
npm install

Run the App
ng serve
Then head to http://localhost:4200 in your browser.

🔗 API Connection

The app is designed to connect to my REST API.
In src/app/fetch-api-data.service.ts, make sure the base URL matches the running backend:

private apiUrl = 'https://your-deployed-api.com'; // Or localhost if local
✨ Features in Action

Home Page	Movie Details	Profile Page
Screenshots not included in this repo yet — adding them soon!

🧭 Folder Overview
myFlix-Angular-client/
├── src/
│   ├── app/
│   │   ├── user-registration/
│   │   ├── user-login/
│   │   ├── movie-card/
│   │   ├── profile/
│   │   └── fetch-api-data.service.ts
├── angular.json
├── package.json
└── README.md

🔐 Sample API Endpoints Used

Method	Endpoint	Purpose
POST	/users	Register new user
POST	/login	Authenticate user
GET	/movies	Fetch all movies
GET	/movies/:title	Get movie details
GET	/directors/:name	Get director info
GET	/genres/:name	Get genre info
PUT	/users/:username	Update profile
DELETE	/users/:username	Delete profile
🙋‍♂️ Why I Built This

This project was part of my full-stack development studies and my commitment to understanding Angular beyond tutorials. It pushed me to think in components, manage state reactively, and implement a clean UI with Material Design.

🧑‍🎓 About Me

I'm Darun Björk, a full-stack developer with a passion for building elegant, scalable apps.
Check out more of my work:

Portfolio: darunbjork.com
GitHub: @darunbjork
LinkedIn: linkedin.com/in/darunbjork
📄 License

This project is open source under the MIT License.
Feel free to fork it, use it, or contribute!

Thanks for checking this out! 
Feel free to star ⭐ the repo if you found it useful or inspiring.
