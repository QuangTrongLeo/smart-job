import { Fragment } from 'react';
import { Routes, Route } from 'react-router-dom';

import { publishRoutes, freelancerRoutes, clientRoutes, adminRoutes } from '~/routes';
import { DefaultLayout } from '~/layouts';

function App() {
  const allRoutes = [
    ...publishRoutes,
    ...freelancerRoutes,
    ...clientRoutes,
    ...adminRoutes,
  ];

  return (
    <Routes>
      {allRoutes.map((route, index) => {
        // Bỏ qua route nếu không có component
        if (!route.component) return null;

        const Page = route.component;

        let Layout = DefaultLayout;
        if (route.layout) {
          Layout = route.layout;
        } else if (route.layout === null) {
          Layout = Fragment;
        }

        return (
          <Route
            key={index}
            path={route.path}
            element={
              <Layout>
                <Page />
              </Layout>
            }
          />
        );
      })}
    </Routes>
  );
}

export default App;