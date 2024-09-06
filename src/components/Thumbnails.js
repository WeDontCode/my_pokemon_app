import React from 'react';

const Thumbnails = ({ pokemon, onClick }) => {
  // Define colors for Pokémon types
  const typeColors = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    // Add other types as needed
    normal: '#A8A878',
    fighting: '#C03028',
    flying: '#A890F0',
    poison: '#A040B0',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#A8B820',
    ghost: '#705898',
    steel: '#B8B8D0',
    fairy: '#F0B6B6',
  };

  const primaryType = pokemon.types[0].type.name; // Get the primary type for background color
  const backgroundColor = typeColors[primaryType] || '#FFFFFF'; // Default to white if type not found

  return (
    <div 
      onClick={onClick} 
      style={{
        cursor: 'pointer', 
        textAlign: 'center', 
        margin: '10px', 
        padding: '10px', 
        backgroundColor, 
        borderRadius: '10px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}
    >
      <img src={pokemon.img} alt={pokemon.name} style={{ width: '100px', height: '100px' }} />
      <p style={{ fontWeight: 'bold' }}>{pokemon.name}</p>
    </div>
  );
};

export default Thumbnails;
