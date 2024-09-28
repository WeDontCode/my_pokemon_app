import React, { useEffect, useState, useCallback } from "react";
import Axios from "axios";
import { Route, Routes } from "react-router-dom";
import PokemonDetail from "./components/PokemonDetail";
import Thumbnails from "./components/Thumbnails";
import ListPokemon from "./components/ListPokemon";
import Modal from "./components/Modal";
import LazyLoad from "react-lazyload";

function App() {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonImages, setPokemonImages] = useState([]);
  const [filteredPokemonImages, setFilteredPokemonImages] = useState([]);
  const [loadedCount, setLoadedCount] = useState(50);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [suggestions, setSuggestions] = useState([]); // Suggestions state

  // Function to fetch Pokémon data
  const fetchPokemonImages = async (count) => {
    setLoading(true);
    const requests = [...Array(count).keys()].map((i) =>
      Axios.get(`https://pokeapi.co/api/v2/pokemon/${i + 1}`)
    );

    try {
      const responses = await Promise.all(requests);
      const newPokemons = responses.map(({ data }) => ({
        name: data.name,
        img: data.sprites.front_default || "",
        types: data.types,
        species: data.species,
        height: data.height,
        weight: data.weight,
      }));
      setPokemonImages((prev) => [...prev, ...newPokemons]);
      setFilteredPokemonImages((prev) => [...prev, ...newPokemons]);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonImages(loadedCount);
  }, [loadedCount]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >=
      document.documentElement.offsetHeight
    ) {
      setLoadedCount((prev) => prev + 20); // Load 20 more Pokémon when scrolling near the bottom
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Modified search function to filter by name and show suggestions
  const handleSearchChange = ({ target: { value } }) => {
    setPokemonName(value.toLowerCase());

    if (value === "") {
      setFilteredPokemonImages(pokemonImages);
      setSuggestions([]); // Clear suggestions
    } else {
      const exactMatch = pokemonImages.find(
        (pokemon) => pokemon.name.toLowerCase() === value.toLowerCase()
      );

      const partialMatches = pokemonImages.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(value.toLowerCase())
      );

      // Show only exact match if found, else show the first partial match
      if (exactMatch) {
        setFilteredPokemonImages([exactMatch]); // Display the exact match if it exists
        setSuggestions([]); // Clear suggestions since we have an exact match
      } else if (partialMatches.length > 0) {
        setFilteredPokemonImages([partialMatches[0]]); // Show the first partial match if no exact match
        setSuggestions(partialMatches); // Set suggestions based on partial matches
      } else {
        setFilteredPokemonImages([]); // No matches
        setSuggestions([]); // Clear suggestions if no matches
      }
    }
  };

  // Function to handle selecting a suggestion
  const handleSuggestionClick = (suggestion) => {
    setPokemonName(suggestion.name);
    setSuggestions([]); // Clear suggestions after selection

    // Optionally filter the images again for the selected Pokémon
    const selectedPokemon = pokemonImages.find(
      (pokemon) => pokemon.name.toLowerCase() === suggestion.name.toLowerCase()
    );
    if (selectedPokemon) {
      setFilteredPokemonImages([selectedPokemon]);
    }
  };

  return (
    <div className="App">
      <div className="TitleSection">
        <h1>Pokedex</h1>
        <input
          type="text"
          onChange={handleSearchChange}
          value={pokemonName}
          placeholder="Enter Pokémon Name"
        />
      </div>

      {/* Suggestions dropdown as cards */}
      {suggestions.length > 0 && (
        <div className="Suggestions" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px" }}>
          {suggestions.map((suggestion, index) => (
            <LazyLoad key={index} height={120} offset={100}>
              <Thumbnails
                pokemon={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
              />
            </LazyLoad>
          ))}
        </div>
      )}

      <div
        className="PokemonImagesSection"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "10px",
        }}
      >
        {filteredPokemonImages.map((pokemon, index) => (
          <LazyLoad key={index} height={120} offset={100}>
            <Thumbnails
              pokemon={pokemon}
              onClick={() => {
                setSelectedPokemon(pokemon);
                setIsModalOpen(true);
              }}
            />
          </LazyLoad>
        ))}
      </div>

      {/* Show loading indicator below the images */}
      {loading && <div className="LoadingIndicator">Loading Pokémon...</div>}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPokemon(null);
        }}
        pokemon={selectedPokemon}
      />

      <Routes>
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
        <Route path="/listpokemon/:name" element={<ListPokemon />} />
      </Routes>
    </div>
  );
}

export default App;
