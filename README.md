
# Faida Finder Frontend

React frontend for Faida Finder, a service that helps Kenyan citizens find and understand available social benefits and services. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Features

- Browse available topics (NSSF Benefits, Disability Services, etc.)
- Ask questions about specific topics
- View answers sourced from official government documentation
- Refresh topic data to ensure up-to-date information

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm (usually comes with Node.js)
- The Faida Finder backend running (default: http://localhost:3333)

### Installation

```bash
# Install dependencies
npm install

## Available Scripts
In the project directory, you can run:

npm start
Runs the app in development mode.
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

npm test
Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

npm run build
Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

## Testing
The frontend uses React Testing Library for component tests and integration testing.

# Component Tests
Located in src/**/*.test.tsx files:

App.test.tsx - Main application component tests
components/TopicList.test.tsx - Topic listing functionality
components/TopicCard.test.tsx - Individual topic display
components/QuestionForm.test.tsx - Question submission form
components/AnswerDisplay.test.tsx - Answer rendering

# Test Coverage Goals
The test suite aims to verify:

Component rendering and layout
User interactions (clicks, form submissions)
API integration with backend
Error handling scenarios
State management
Accessibility features

# Running Tests
# Run tests once
npm test

# Run tests in watch mode (useful during development)
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage

# Continuous Integration
Tests are automatically run in the GitHub Actions CI pipeline:

Triggers: Push to main or collins-branch
Steps:
Install dependencies
Run linting and type checks
Execute all unit tests
Generate coverage report
Build production bundle
Report test results

## Environment Configuration
The frontend uses these environment variables:

REACT_APP_API_BASE - Backend API URL (default: http://localhost:3333)
Set them using a .env file or when starting the development server:

## Project Structure
src/
  ├── components/       # React components
  │   ├── TopicList.tsx    # Lists all available topics
  │   ├── TopicCard.tsx    # Shows topic info and Q&A interface
  │   ├── QuestionForm.tsx # Form for asking questions
  │   └── AnswerDisplay.tsx # Renders API responses
  ├── services/        # Backend API integration
  │   └── api.ts       # API client functions
  ├── types/          # TypeScript definitions
  ├── App.tsx         # Main application component
  └── index.tsx       # Application entry point

# Learn More
Create React App documentation: https://facebook.github.io/create-react-app/docs/getting-started 
React documentation: https://reactjs.org/ 