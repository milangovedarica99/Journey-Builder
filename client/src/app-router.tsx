import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const GraphPage = lazy(() => import('@/pages/blueprint-page'));

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<GraphPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRouter;
