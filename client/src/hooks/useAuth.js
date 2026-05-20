import { useSelector, useDispatch } from 'react-redux';
import { login, register, logout, getMe, clearError } from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return {
    ...auth,
    login: (data) => dispatch(login(data)),
    register: (data) => dispatch(register(data)),
    logout: () => dispatch(logout()),
    getMe: () => dispatch(getMe()),
    clearError: () => dispatch(clearError()),
    isAdmin: auth.user?.role === 'admin',
  };
};
