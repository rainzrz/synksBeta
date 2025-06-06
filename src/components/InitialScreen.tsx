
import { useEffect, useState } from 'react';

interface InitialScreenProps {
  onComplete: () => void;
}

const InitialScreen = ({ onComplete }: InitialScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 2000); // Show for 2 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #550a35 0%, #131b40 100%)'
      }}
    >
      <h1 className="text-6xl md:text-8xl font-bold text-white tracking-wider animate-fade-in">
        SYSTEM HAUS
      </h1>
    </div>
  );
};

export default InitialScreen;
