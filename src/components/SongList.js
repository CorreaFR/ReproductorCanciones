import React from 'react';
import './SongList.css';

const extractYoutubeId = (url) => {
  const regExp = /(?:youtube\.com.*[?&]v=|youtu\.be\/)([^&#]+)/;
  const match = url.trim().match(regExp);
  return match ? match[1] : null;
};

const SongList = ({ songs, onPlay, onDelete }) => {
  if (songs.length === 0) return <p>No hay canciones guardadas.</p>;

  return (
    <div className="row g-2">
      {songs.map((song, index) => (
        <div key={index} className="col-12">
          <div className="card song-card shadow-sm p-3 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
            <div className="song-info d-flex align-items-center gap-3 w-100 mb-2 mb-sm-0">
              <img
                src={`https://img.youtube.com/vi/${extractYoutubeId(song.url)}/default.jpg`}
                alt={`Miniatura de ${song.name}`}
                className="rounded"
                style={{ width: '80px', height: '60px', objectFit: 'cover' }}
              />
              <div className="flex-grow-1">
                <strong className="text-truncate d-block" title={song.name}>
                  {song.name}
                </strong>
                <small className="text-truncate d-none d-md-block" title={song.url}>
                  {song.url}
                </small>
              </div>
            </div>

            <div className="button-group d-flex flex-wrap gap-2 justify-content-sm-end w-100 w-sm-auto">
              <button
                className="btn btn-play btn-sm same-size-btn"
                onClick={() => onPlay(index)}
                title="Reproducir esta canción"
              >
                <i className="bi bi-play-fill me-1"></i>
                <span className="d-none d-md-inline">Play</span>
              </button>

              <button
                className="btn btn-delete btn-sm same-size-btn"
                onClick={() => onDelete(index)}
                title="Eliminar esta canción"
              >
                <i className="bi bi-trash-fill me-1"></i>
                <span className="d-none d-md-inline">Eliminar</span>
              </button>

              <span
                className="badge bg-secondary plays-badge text-nowrap"
                title={`Cantidad de veces que se reprodujo: ${song.plays}`}
              >
                <span className="d-none d-md-inline">Reproducciones:&nbsp;</span>
                {song.plays}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SongList;
