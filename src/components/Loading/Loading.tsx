import type { FC } from 'react';
import './Loading.css';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
}

const Loading: FC<LoadingProps> = ({
  message = 'Loading...',
  size = 'medium',
  fullPage = false,
}) => {
  return (
    <div className={`loading-container ${fullPage ? 'loading-fullpage' : ''} loading-${size}`}>
      <div className="loading-spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default Loading;
