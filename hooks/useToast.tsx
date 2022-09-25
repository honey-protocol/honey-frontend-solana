import HoneyToast, {
  HoneyToastProps,
  toastRemoveDelay,
  ToastState
} from 'components/HoneyToast/HoneyToast';
import React, { createContext, useState } from 'react';

export interface ToastProps {
  toast: {
    processing: Function;
    success: Function;
    error: Function;
    clear: Function;
    state: ToastState | null;
  };
  ToastComponent: JSX.Element | null;
}

const useToast = () => {
  const [toast, setToast] = useState<HoneyToastProps | null>(null);

  const ToastComponent = () => {
    if (!toast?.state) return null;
    return (
      <HoneyToast
        state={toast.state}
        primaryText={toast.primaryText}
        secondaryLink={toast.secondaryLink}
      />
    );
  };

  const clearToast = () => {
    setTimeout(() => {
      setToast(null);
    }, toastRemoveDelay);
  };

  return {
    toast: {
      processing: (
        primaryText: string = 'Transaction in progress',
        secondaryLink?: string
      ) =>
        setToast({
          state: 'loading',
          primaryText,
          secondaryLink
        }),
      success: (primaryText: string, secondaryLink?: string) => {
        setToast({
          state: 'success',
          primaryText,
          secondaryLink
        });
        clearToast();
      },
      error: (primaryText: string, secondaryLink?: string) => {
        setToast({
          state: 'error',
          primaryText,
          secondaryLink
        });
        clearToast();
      },

      clear: clearToast,
      state: toast?.state || null
    },
    ToastComponent
  };
};

export default useToast;
