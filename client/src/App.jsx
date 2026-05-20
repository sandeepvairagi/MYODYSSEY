import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';
import { getMe } from './redux/slices/authSlice';
import { fetchWishlist } from './redux/slices/wishlistSlice';

function AppInitializer({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(getMe()).then((res) => {
        if (getMe.fulfilled.match(res)) dispatch(fetchWishlist());
      });
    }
  }, [dispatch]);
  return children;
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <AppInitializer>
              <AppRoutes />
            </AppInitializer>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          </ErrorBoundary>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}
