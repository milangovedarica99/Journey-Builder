import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router-dom';

import AppRouter from '@/app-router';
import ErrorPage from '@/components/feedback/error-page';
import LoadingScreen from '@/components/feedback/loading-screen';

const App = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary fallbackRender={() => <ErrorPage />}>
        <Suspense fallback={<LoadingScreen />}>
          <AppRouter />
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
