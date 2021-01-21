import React, {useState, createContext, useCallback, ReactNode, useRef, useEffect} from 'react';

const initialToast = {
  message: '',
  type: null,
  visible: false,
};

interface Props {
    children: ReactNode;
}

export const ToastContext = createContext({show: ({}) => {} , toast: initialToast, hide: ({}) => {}});

const ToastProvider: React.FC<Props> = ({children}) => {
  const [toast, setToast] = useState(initialToast);
  const timeout = useRef({});

  const show = useCallback((args) => {
    setToast({...initialToast, visible: true, ...args});
  }, []);

  const hide = useCallback(() => {
    setToast({...toast, visible: false});
  }, [toast]);

  useEffect(() => {
    if (toast.visible) {
      timeout.current = setTimeout(hide, 1500);
      return () => {
        if (timeout.current) {
          //clearTimeout(timeout.current);
        }
      };
    }
  }, [hide, toast]);

  return (
    <ToastContext.Provider
      value={{
        hide,
        show,
        toast,
      }}>
          {children}
      </ToastContext.Provider>
  );
}

export default ToastProvider;
