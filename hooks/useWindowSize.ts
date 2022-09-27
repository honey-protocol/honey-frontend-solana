import { useState, useEffect } from 'react';

function getWindowSize() {
  const { outerWidth: width, outerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
