import React, { useState } from 'react';

const AddSongForm = ({ onAddSong, formError }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const isValidYoutubeUrl = (input) => {
    return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(input);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !url.trim()) {
      return setError('Todos los campos son obligatorios.');
    }

    if (!isValidYoutubeUrl(url)) {
      return setError('La URL debe ser válida de YouTube.');
    }

    onAddSong({ name: name.trim(), url });
    setName('');
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-4">
      {(error || formError) && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error || formError}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="songName" className="form-label fw-semibold">🎵 Nombre de la canción</label>
        <input
          id="songName"
          type="text"
          className="form-control"
          placeholder="Ej: Imagine - John Lennon"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>

      <div className="mb-3">
        <label htmlFor="songUrl" className="form-label fw-semibold">🔗 URL de YouTube</label>
        <input
          id="songUrl"
          type="url"
          className="form-control"
          placeholder="https://www.youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-agregar" title="Agregar canción a la lista">
        <i className="bi bi-plus-circle me-2"></i>
        Agregar
      </button>
    </form>
  );
};

export default AddSongForm;
