import React, { useState } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, pokemon }) => {
  const [activeSection, setActiveSection] = useState('about');
  if (!isOpen || !pokemon) return null;

  const typeColors = {
    fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
    ice: '#98D8D8', normal: '#A8A878', fighting: '#C03028', poison: '#A040B0',
    ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
    rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
    steel: '#B8B8D0', fairy: '#F0B0B0',
  };

  const primaryType = pokemon.types?.[0]?.type?.name;
  const backgroundColor = typeColors[primaryType] || '#FFFFFF';

  const renderSection = () => {
    const { species, height, weight, stats, moves } = pokemon;
    switch (activeSection) {
      case 'about':
        return (
          <div>
            <h3>About</h3>
            <p>Species: {species?.name || 'Unknown'}</p>
            <p>Type: {pokemon.types?.map(type => type.type.name).join(', ') || 'Unknown'}</p>
            <p>Height: {height ? height / 10 : 'Unknown'} m</p>
            <p>Weight: {weight ? weight / 10 : 'Unknown'} kg</p>
          </div>
        );
      case 'baseStats':
        return (
          <div>
            <h3>Base Stats</h3>
            {stats?.map((stat, index) => (
              <p key={index}>{stat.stat.name}: {stat.base_stat}</p>
            )) || <p>No stats available.</p>}
          </div>
        );
      case 'evolution':
        return (
          <div>
            <h3>Evolution</h3>
            <p>Evolution data not available.</p>
          </div>
        );
      case 'moves':
        return (
          <div>
            <h3>Moves</h3>
            <ul>
              {moves?.slice(0, 10).map((move, index) => (
                <li key={index}>{move.move.name}</li>
              )) || <li>No moves available.</li>}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ backgroundColor }} onClick={(e) => e.stopPropagation()}>
        <h1>{pokemon.name.toUpperCase()}</h1>
        <img src={pokemon.img || 'placeholder-image.png'} alt={pokemon.name} />

        <div className="section-buttons">
          {['about', 'baseStats', 'evolution', 'moves'].map(section => (
            <button key={section} onClick={() => setActiveSection(section)}>
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        <div className="section-content">{renderSection()}</div>

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
