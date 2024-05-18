import React from 'react'
import {captureException, captureMessage} from '@sentry/react'

const Component = () => {
  return <div onClick={errorsourcemap}>init</div>
}

class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  }

  static getDerivedStateFromError(err){
    captureMessage(`will report an error because of ${err}`)
    return {
      hasError: true 
    }
  }

  componentDidCatch(err, stack){
    console.log('error-catch: ', err, stack)
    captureException(err)
  }

  render(){
    if(this.state.hasError){
      return <div>oops</div>
    }

    return this.props.children
  }
}

// const WrappedComponent = withErrorBoundary(Component, {fallback: <div>oops</div>})
export default function App(){
  // return <Component />
  return <>
    <ErrorBoundary> <Component /> </ErrorBoundary>
    {/* <SentryErrorBoundary fallback={<div>oops</div>}> <Component /> </SentryErrorBoundary> */}
    {/* <WrappedComponent /> */}
  </>
}