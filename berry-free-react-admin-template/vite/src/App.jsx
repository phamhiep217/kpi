import { RouterProvider } from 'react-router-dom';


// routing
import router from './routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

import ThemeCustomization from 'themes';
import config from './config'

// auth provider

// ==============================|| APP ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <NavigationScroll>
        <RouterProvider router={router} basename={config.basename}>
        </RouterProvider>
      </NavigationScroll>
    </ThemeCustomization>
  );
}
