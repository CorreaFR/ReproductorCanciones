import React, { useState, useEffect } from 'react';
import AddSongForm from './components/AddSongForm';
import SongList from './components/SongList';
import VideoModal from './components/VideoModal';

function App() {
  const [songs, setSongs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSorted, setIsSorted] = useState(false);
  const [formError, setFormError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('songs')) || [];
    setSongs(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme === 'dark' ? 'bg-dark' : '';
  }, [theme]);

  const extractYoutubeId = (url) => {
    const regExp = /(?:youtube\.com.*[?&]v=|youtu\.be\/)([^&#]+)/;
    const match = url.trim().match(regExp);
    return match ? match[1] : null;
  };

  const handleAddSong = (newSong) => {
    const newId = extractYoutubeId(newSong.url);
    if (!newId) {
      setFormError('La URL no es válida.');
      return;
    }

    const idAlreadyExists = songs.some(
      (song) => extractYoutubeId(song.url) === newId
    );

    if (idAlreadyExists) {
      setFormError('⚠️ Esta canción ya ha sido registrada.');
      return;
    }

    const formattedSong = {
      name: newSong.name.trim(),
      url: newSong.url.trim(),
      plays: 0,
    };

    const updated = isSorted
      ? [...songs, formattedSong]
      : [formattedSong, ...songs];

    setSongs(updated);
    localStorage.setItem('songs', JSON.stringify(updated));
    setFormError('');
  };

  const handlePlay = (index) => {
    const updated = [...songs];
    updated[index].plays += 1;
    setSongs(updated);
    localStorage.setItem('songs', JSON.stringify(updated));

    setCurrentVideoUrl(songs[index].url);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    const songName = songs[index].name;
    const confirmDelete = window.confirm(`¿Seguro que quieres eliminar "${songName}"?`);
    if (!confirmDelete) return;

    const updated = [...songs];
    updated.splice(index, 1);
    setSongs(updated);
    localStorage.setItem('songs', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (window.confirm('¿Seguro de que quieres eliminar toda la lista de canciones?')) {
      setSongs([]);
      localStorage.removeItem('songs');
    }
  };

  const handleExport = (format = 'json') => {
    if (!songs.length) return;

    const dataStr = format === 'json'
      ? JSON.stringify(songs, null, 2)
      : songs.map((s, i) =>
          `${i + 1}. ${s.name} - ${s.url} (Reproducciones: ${s.plays})`
        ).join('\n');

    const blob = new Blob([dataStr], {
      type: format === 'json' ? 'application/json' : 'text/plain',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `canciones.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filtered = songs
    .filter(song => song.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (isSorted ? b.plays - a.plays : 0));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedSongs = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div
        className={`container mt-5 p-4 shadow-sm ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white text-dark'}`}
        style={{
          borderRadius: '0.75rem',
          transition: 'background-color 0.3s, color 0.3s, border-radius 0.3s',
        }}
      >
        <h1 className="mb-4 d-flex align-items-center gap-2">
          <i className="bi-headphones"></i>
          Reproductor de Música
        </h1>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            className="btn btn-outline-success"
            onClick={() => handleExport('json')}
            title="Descargar la lista de canciones como archivo JSON"
          >
            <i className="bi bi-download me-2"></i>Exportar lista
          </button>

          <button
            className={`btn ${theme === 'light' ? 'btn-outline-dark' : 'btn-outline-light'}`}
            style={{ minWidth: '160px' }}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <i className={`bi ${theme === 'light' ? 'bi-moon' : 'bi-sun'} me-2`}></i>
            {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
          </button>
        </div>

        <AddSongForm onAddSong={handleAddSong} formError={formError} />

        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="🔎 Buscar canción por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mb-4 d-flex justify-content-between align-items-center">
          <button
            className="btn btn-clear-all"
            style={{ minWidth: '180px' }}
            onClick={handleClearAll}
            title="Eliminar todas las canciones guardadas"
          >
            <i className="bi bi-trash3 me-2"></i>
            Eliminar todo
          </button>

          <button
            className="btn btn-outline-secondary"
            style={{ minWidth: '220px' }}
            onClick={() => setIsSorted(!isSorted)}
          >
            <i className={`bi ${isSorted ? 'bi-arrow-down-up' : 'bi-sort-down'} me-2`}></i>
            {isSorted ? 'Orden original' : 'Ordenar por reproducciones'}
          </button>
        </div>

        <SongList songs={paginatedSongs} onPlay={handlePlay} onDelete={handleDelete} />

        <div className="d-flex justify-content-center my-4">
          <nav>
            <div className="custom-pagination d-flex gap-2 justify-content-center flex-wrap mt-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </nav>
        </div>

        <VideoModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          youtubeUrl={currentVideoUrl}
        />
      </div>

      <footer className="text-center mt-5 pt-4 pb-2 mb-3 border-top small text-muted">
        © {new Date().getFullYear()} Reproductor de Canciones - Hecho por Federico Correa
      </footer>
    </>
  );
}

export default App;
