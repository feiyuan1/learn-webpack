import {createRoot} from 'react-dom/client'
import React from 'react'
import App from './App.jsx'
import * as Sentry from "@sentry/react";

Sentry.init({
  // 4507215603433472 projectid
  dsn: "https://705994e199a11d1feb739c5a3fdf0750@o4507215598125056.ingest.us.sentry.io/4507215603433472",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost"],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

export default function initReact(){
  const root = document.getElementById('root')

  createRoot(root).render(<App />)
}