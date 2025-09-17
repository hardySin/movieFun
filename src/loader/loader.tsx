import React from 'react';
import '../loader/loader.css';

interface LoaderProps {
  state: boolean;
  message?: string;
  size?: number;
}

const Loader: React.FC<LoaderProps> = ({
  state,
  message = "Loading...",
  size = 60
}) => {
  if (!state) return null;

  return (
    <div className={`loader-container ${state ? 'loader-visible' : 'loader-hidden'}`}>
      <div className="loader-content">
        <div className="loader-spinner" style={{ width: size, height: size }}>
          <div className="loader-gradient-circle">
            <div className="loader-inner-circle" style={{ width: size - 20, height: size - 20 }}></div>
          </div>
        </div>
        {message && (
          <p className="loader-message">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Loader;