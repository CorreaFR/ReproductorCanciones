import React from 'react';
import Modal from 'react-modal';
import './VideoModal.css';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '800px',
    border: 'none',
    padding: 0,
    backgroundColor: '#fff',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
    borderRadius: '7px',
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 1050,
    transition: 'opacity 0.3s ease-in-out',
  },
};

const VideoModal = ({ isOpen, onRequestClose, youtubeUrl }) => {
  const getYoutubeId = (url) => {
    const regExp = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&#]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const videoId = getYoutubeId(youtubeUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Reproductor de Video"
      closeTimeoutMS={300}
    >
      <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom bg-light">
        <h5 className="mb-0 text-dark">
          <i className="bi bi-camera-reels me-2"></i>
          Reproduciendo VideoClip
        </h5>
        <button
          type="button"
          className="btn btn-close"
          aria-label="Cerrar"
          onClick={onRequestClose}
        ></button>
      </div>
      <div className="ratio ratio-16x9">
        <iframe
          src={embedUrl}
          title="YouTube Video"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>
    </Modal>
  );
};

export default VideoModal;
