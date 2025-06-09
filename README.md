
# ZealthyProject 🧠

An interactive multi-step onboarding application built with **Next.js 14**, **Tailwind CSS**, and **Firebase**. The app guides users through a login/signup process and collects information through a configurable stepper form, storing everything in Firestore in real time. Includes a `/data` route for admin/testing purposes.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
🧪 Admin Testing Page

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🌟 Features

- 🔐 **Authentication**: Email/password login & signup using Firebase.
- 🧭 **Stepper Flow**: Multi-step form navigation with validation.
- 💾 **Firestore Sync**: Each valid input is saved in Firestore live.
- 🔁 **Session Resume**: Users return to the last incomplete step on login.
- 👀 **Admin View**: A `/data` route shows all users’ submitted data.
- ⚙️ **Dynamic Config**: Step fields controlled via `formConfig/componentAssignment`.

---

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase Auth](https://firebase.google.com/products/auth)
- [Firestore](https://firebase.google.com/products/firestore)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)


---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/shivangi2299/ZealthyProject.git
cd ZealthyProject


### Setup Firebase

Go to Firebase Console

Create a project and enable:

Authentication (Email/Password)

Firestore Database

Copy your Firebase config into app/firebase/config.js

// Example config
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};


🗺️ Summary Flow

[Login/Signup]
     ↓
[Step 2: About Info] ←→ Realtime Field Save
     ↓
[Step 3: Address Info] ←→ Realtime Field Save
     ↓
[Submit] → Redirect → /home?name=FirstName


There are /data and /admin page for data view in database and toggling the features of step 2 and step 3 respectively.

🧑‍💻 Author
Shivangi Patel
📧 shivangi.p@mymailkeeper.com
