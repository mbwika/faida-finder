# Faida Finder Frontend# Getting Started with Create React App



React frontend for Faida Finder, a service that helps Kenyan citizens find and understand available social benefits and services. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).



## Features## Available Scripts



- Browse available topics (NSSF Benefits, Disability Services, etc.)In the project directory, you can run:

- Ask questions about specific topics

- View answers sourced from official government documentation### `npm start`

- Refresh topic data to ensure up-to-date information

Runs the app in the development mode.\

## Getting StartedOpen [http://localhost:3000](http://localhost:3000) to view it in the browser.



### PrerequisitesThe page will reload if you make edits.\

You will also see any lint errors in the console.

- Node.js (v18 or later recommended)

- npm (usually comes with Node.js)### `npm test`

- The Faida Finder backend running (default: http://localhost:3333)

Launches the test runner in the interactive watch mode.\

### InstallationSee the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.



```bash### `npm run build`

# Install dependencies

npm installBuilds the app for production to the `build` folder.\

```It correctly bundles React in production mode and optimizes the build for the best performance.



### Environment SetupThe build is minified and the filenames include the hashes.\

Your app is ready to be deployed!

The app expects the backend API to be running. Configure the API URL with the REACT_APP_API_BASE environment variable:

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

```bash

# Start with default API URL (http://localhost:3333)### `npm run eject`

npm start

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

# OR start with custom API URL

REACT_APP_API_BASE=http://localhost:3000 npm startIf you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

```

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

The app will open in your default browser at http://localhost:3000 (or next available port).

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Project Structure

## Learn More

```

src/You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

  components/         # React components

    TopicList.tsx    # Lists all available topicsTo learn React, check out the [React documentation](https://reactjs.org/).

    TopicCard.tsx    # Shows topic info and Q&A interface
    QuestionForm.tsx # Form for asking questions
    AnswerDisplay.tsx # Renders API responses
  services/
    api.ts           # API client for backend communication
  App.tsx            # Root component
  index.tsx          # Entry point
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode with hot reloading.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Note: Set REACT_APP_API_BASE if your backend runs on a different URL than http://localhost:3333.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).