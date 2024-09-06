import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Thumbnails from './Thumbnails';

const ListPokemon = () => {
  const location = useLocation();
  const { pokemon } = location.state || {}; // Retrieve Pokémon from state

  if (!pokemon) {
    return <div>No Pokémon data available</div>;
  }

  return (
    <div>
      <h2>Details for {pokemon.name}</h2>
      <Link to={`/pokemon/${pokemon.name}`}>
        <Thumbnails pokemon={pokemon} />
      </Link>
    </div>
  );
};

export default ListPokemon;
