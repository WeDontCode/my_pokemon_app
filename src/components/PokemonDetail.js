import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PokemonDetail = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSection, setShowSection] = useState('');
  const navigate = useNavigate();

  const typeColors = {
    fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
  };

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        const { data } = await Axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        setPokemon(data);
        const { data: speciesData } = await Axios.get(data.species.url);
        setSpecies(speciesData);
      } catch (error) {
        console.error("Error fetching Pokémon details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemonDetail();
  }, [name]);

  if (loading) return <h3>Loading...</h3>;
  if (!pokemon || !species) return <h3>Error fetching Pokémon data</h3>;

  const primaryType = pokemon.types[0].type.name;
  const backgroundColor = typeColors[primaryType] || '#FFFFFF';

  const toggleSection = (section) => {
    setShowSection(showSection === section ? '' : section);
  };

  return (
    <div style={{ backgroundColor, padding: '20px', borderRadius: '10px' }}>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>{pokemon.name.toUpperCase()}</h1>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ display: 'block', margin: '0 auto', width: '150px', height: '150px' }} />
      <div className="section-buttons" style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
        {['about', 'baseStats', 'evolution', 'moves'].map(section => (
          <button key={section} onClick={() => toggleSection(section)}>{section.charAt(0).toUpperCase() + section.slice(1)}</button>
        ))}
      </div>

      {showSection === 'about' && (
        <div className="about">
          <h3>About</h3>
          <p>Species: {species.genera.find(g => g.language.name === 'en').genus}</p>
          <p>Type: {pokemon.types.map(type => type.type.name).join(', ')}</p>
          <p>Height: {pokemon.height / 10} m</p>
          <p>Weight: {pokemon.weight / 10} kg</p>
        </div>
      )}

      {showSection === 'baseStats' && (
        <div className="base-stats">
          <h3>Base Stats</h3>
          {pokemon.stats.map((stat, index) => (
            <p key={index}>{stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}: {stat.base_stat}</p>
          ))}
        </div>
      )}

      {showSection === 'evolution' && (
        <div className="evolution">
          <h3>Evolution</h3>
          <p>Evolution data not available (yet).</p>
        </div>
      )}

      {showSection === 'moves' && (
        <div className="moves">
          <h3>Moves</h3>
          <ul>
            {pokemon.moves.slice(0, 10).map((move, index) => (
              <li key={index}>{move.move.name.charAt(0).toUpperCase() + move.move.name.slice(1)}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={() => navigate('/')}>Back to Index</button>
    </div>
  );
};

export default PokemonDetail;
