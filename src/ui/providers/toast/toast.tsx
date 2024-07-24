import { createContext, useCallback, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastType } from './types';
import { IToastType } from '../../../types/ToastType';

interface ToastProps {
  renderToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastProps | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line
  const renderToast = useCallback((type: ToastType, message: string) => {
    switch (type) {
      case IToastType.SUCCESS:
        toast.success(message);
        break;
      case IToastType.ERROR:
        toast.error(message);
        break;
      default:
        '';
    }
  }, []);

  return (
    <ToastContext.Provider
      value={{
        renderToast,
      }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
