# EchoSphere

EchoSphere is a modern, responsive mini social media platform built with Next.js and Firebase. It allows users to sign up, create posts, follow other users, and interact with content through likes and comments.

## Features

-   **Authentication**: Secure user signup and login with Firebase Authentication.
-   **User Profiles**: Viewable user profiles with post feeds, follower/following counts.
-   **Social Feed**: A chronological feed of posts from all users.
-   **Create Posts**: Users can create and share short text-based posts.
-   **Interactions**: Like posts and add comments.
-   **Follow System**: Users can follow and unfollow each other.
-   **Real-time Updates**: UI updates in real-time using Firestore snapshots.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore)
-   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **AI (Optional)**: [Genkit](https://firebase.google.com/docs/genkit) for generative AI features.

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   A [Google account](https://accounts.google.com/signup) to create a Firebase project.

### 1. Set up Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"** and follow the steps to create a new project.
3.  Once your project is created, navigate to the **Project Settings** (click the gear icon next to "Project Overview").
4.  Under the **"General"** tab, scroll down to **"Your apps"**.
5.  Click the web icon (`</>`) to create a new web app.
6.  Give your app a nickname and click **"Register app"**.
7.  Firebase will provide you with a `firebaseConfig` object. **Copy these values.** You will need them in the next step.
8.  In your project dashboard, go to the **Build** section.
    *   Enable **Firestore Database**. Create a database in **Production mode**.
    *   Enable **Authentication**. Choose the **Email/Password** sign-in method and enable it.

### 2. Local Project Setup

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    *   Create a copy of the example environment file. You'll store your secret keys here.
        ```bash
        cp .env.example .env
        ```
    *   Open the newly created `.env` file and paste the `firebaseConfig` values you copied from the Firebase console.

    Your `.env` file should look like this:
    ```
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY="your-copied-api-key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-copied-auth-domain"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-copied-project-id"
    # ... and so on for all firebase config values
    ```

4.  **Set up Firebase CLI and Deploy Rules**:
    *   If you don't have it, install the Firebase CLI globally:
        ```bash
        npm install -g firebase-tools
        ```
    *   Log in to your Google account:
        ```bash
        firebase login
        ```
    *   Associate your local project with your Firebase project:
        ```bash
        firebase use --add
        ```
        Select the project you created from the list.
    *   Deploy the Firestore security rules and indexes. This is a crucial step for the app's features (like following users) to work correctly.
        ```bash
        firebase deploy --only firestore
        ```

### 3. Run the Application

Now you're ready to start the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) (or whatever port is specified in your console) with your browser to see the result.

---

## Other Commands

-   **Build for production**:
    ```bash
    npm run build
    ```
-   **Run production server**:
    ```bash
    npm run start
    ```
