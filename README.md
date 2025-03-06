# Dashboard Frontend

A React-based frontend for the dashboard application with Firebase Authentication integration.

## Features

- User authentication with Firebase
- Admin panel for user management
- Company management
- Onboarding progress tracking
- Responsive Material UI design

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5001
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   REACT_APP_AUTH_MODE=firebase
   ```
4. Start the development server:
   ```
   npm start
   ```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Technologies Used

- React
- TypeScript
- Material UI
- Firebase Authentication
- Context API for state management

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Updated for CI/CD
Last updated: 2025-03-06 17:30 - Testing automated deployment to app.syntheticteams.com
