import React, { useState } from 'react';
import '../movieView/playVideo.css';

interface PlayVideoProps {
  videoUrl?: string;
  title?: string;
  thumbnail?: string;
}

const PlayVideo: React.FC<PlayVideoProps> = ({
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
  title = "Movie Trailer",
  thumbnail = "https://via.placeholder.com/300x169/667eea/ffffff?text=Play+Video"
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="play-video-container">
      <div className="video-thumbnail" onClick={() => setShow(true)}>
        <img src={thumbnail} alt={title} className="thumbnail-image" />
        <div className="play-overlay">
          <div className="play-button">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="video-info">
          <h4 className="video-title">{title}</h4>
          <p className="video-description">Click to watch trailer</p>
        </div>
      </div>

      {show && (
        <div className="video-modal-overlay">
          <div className="video-modal">
            <div className="video-modal-header">
              <h3 className="video-modal-title">{title}</h3>
              <button
                type="button"
                className="video-modal-close"
                onClick={() => setShow(false)}
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="video-modal-body">
              <div className="video-wrapper">
                <iframe
                  src={videoUrl}
                  title={title}
                  className="video-iframe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
            <div className="video-modal-footer">
              <button
                className="video-modal-close-btn"
                onClick={() => setShow(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayVideo;