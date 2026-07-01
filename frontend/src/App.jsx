import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import ThemeCustomization from './themes';
import AppRoutes from './routes';

export default function App() {
  return (
    <ThemeCustomization>
      <AuthProvider>
        <StoreProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </StoreProvider>
      </AuthProvider>
    </ThemeCustomization>
  );
}
