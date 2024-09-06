import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Route, Routes } from "react-router-dom";
import PokemonDetail from "./components/PokemonDetail";
import Thumbnails from "./components/Thumbnails";
import ListPokemon from "./components/ListPokemon";
import Modal from "./components/Modal";

function App() {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonImages, setPokemonImages] = useState([]);
  const [filteredPokemonImages, setFilteredPokemonImages] = useState([]);
  const [loadedCount, setLoadedCount] = useState(50);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPokemonImages = async () => {
      const requests = [...Array(600).keys()].map(i => Axios.get(`https://pokeapi.co/api/v2/pokemon/${i + 1}`));
      try {
        const responses = await Promise.all(requests);
        const pokemons = responses.map(({ data }) => ({
          name: data.name,
          img: data.sprites.front_default || "",
          types: data.types,
          species: data.species,
          height: data.height,
          weight: data.weight,
        }));
        setPokemonImages(pokemons);
        setFilteredPokemonImages(pokemons.slice(0, loadedCount));
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };
    fetchPokemonImages();
  }, [loadedCount]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight) {
        setLoadedCount(prev => Math.min(prev + 20, pokemonImages.length));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pokemonImages]);

  useEffect(() => {
    setFilteredPokemonImages(pokemonImages.slice(0, loadedCount));
  }, [loadedCount, pokemonImages]);

  const handleSearchChange = ({ target: { value } }) => {
    setPokemonName(value);
    if (value === "") {
      // Clear search input and reset to full list
      setLoadedCount(pokemonImages.length); // Set to show all Pokémon
      setFilteredPokemonImages(pokemonImages); // Show full list
    } else {
      const filteredPokemons = pokemonImages.filter(pokemon =>
        pokemon.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPokemonImages(filteredPokemons.slice(0, Math.min(loadedCount, filteredPokemons.length)));
    }
  };

  return (
    <div className="App">
      <div className="TitleSection">
        <h1>Pokedex</h1>
        <input type="text" onChange={handleSearchChange} value={pokemonName} placeholder="Enter Pokémon Name" />
      </div>

      <div className="PokemonImagesSection" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px" }}>
        {filteredPokemonImages.map((pokemon, index) => (
          <Thumbnails key={index} pokemon={pokemon} onClick={() => {
            setSelectedPokemon(pokemon);
            setIsModalOpen(true);
          }} />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setSelectedPokemon(null);
      }} pokemon={selectedPokemon} />

      <Routes>
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
        <Route path="/listpokemon/:name" element={<ListPokemon />} />
      </Routes>
    </div>
  );
}

export default App;
