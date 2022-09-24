import HoneyToast, {
  HoneyToastProps,
  toastRemoveDelay
} from 'components/HoneyToast/HoneyToast';
import React, { useState } from 'react';

const useToast = () => {
  const [toast, setToast] = useState<HoneyToastProps | null>(null);

  const ToastComponent = () => {
    if (!toast?.state) return;
    return (
      <HoneyToast
        state={toast.state}
        primaryText={toast.primaryText}
        secondaryLink={toast.secondaryLink}
      />
    );
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
      success: (primaryText: string, secondaryLink?: string) =>
        setToast({
          state: 'success',
          primaryText,
          secondaryLink
        }),
      error: (primaryText: string, secondaryLink?: string) =>
        setToast({
          state: 'error',
          primaryText,
          secondaryLink
        }),
      clear: () =>
        setTimeout(() => {
          setToast(null);
        }, toastRemoveDelay),
      state: toast?.state
    },
    ToastComponent
  };
};

export default useToast;
