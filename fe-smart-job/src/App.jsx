// src/App.jsx
import { Fragment } from 'react';
import { Routes, Route } from 'react-router-dom';

import { publishRoutes, freelancerRoutes, clientRoutes, adminRoutes } from '~/routes';
import { DefaultLayout } from '~/layouts';
import ProtectedRoute from '~/components/ProtectedRoute/ProtectedRoute'; // Import ProtectedRoute

function App() {
  // Hàm render Route kèm theo Layout và Bọc ProtectedRoute nếu cần
  const renderRoutes = (routes, allowedRoles = null) => {
    return routes.map((route, index) => {
      if (!route.component) return null;

      const Page = route.component;

      let Layout = DefaultLayout;
      if (route.layout) {
        Layout = route.layout;
      } else if (route.layout === null) {
        Layout = Fragment;
      }

      // Nội dung JSX của route
      const element = (
        <Layout>
          <Page />
        </Layout>
      );

      return (
        <Route
          key={index}
          path={route.path}
          element={
            allowedRoles ? (
              <ProtectedRoute allowedRoles={allowedRoles}>
                {element}
              </ProtectedRoute>
            ) : (
              element
            )
          }
        />
      );
    });
  };

  return (
    <Routes>
      {/* 1. Public Routes: Ai cũng truy cập được */}
      {renderRoutes(publishRoutes)}

      {/* 2. Client Routes: Chỉ dành cho Client */}
      {renderRoutes(clientRoutes, ['CLIENT'])}

      {/* 3. Freelancer Routes: Chỉ dành cho Freelancer */}
      {renderRoutes(freelancerRoutes, ['FREELANCER'])}

      {/* 4. Admin Routes: Chỉ dành cho Admin */}
      {renderRoutes(adminRoutes, ['ADMIN'])}
    </Routes>
  );
}

export default App;