import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import SearchBar from './components/SearchBar';
import RestaurantCard from './components/RestaurantCard';
import { motion } from 'framer-motion';

// Mock filter chips - in a real app these might verify against backend or filter locally
const filterChips = [
  { label: 'Biryani', query: 'Biryani' },
  { label: 'Masala Dosa', query: 'Masala Dosa' },
  { label: 'Idli', query: 'Idli' },
  { label: 'Pasta', query: 'Pasta' },
  { label: 'Pizza', query: 'Pizza' },
  { label: 'Burger', query: 'Burger' },
];

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (searchTerm) => {
    if (!searchTerm) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const baseUrl = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';
      const response = await axios.get(`${baseUrl}/search`, { params: { q: searchTerm } });
      setResults(response.data);
    } catch (error) {
      console.error('Search failed', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (chipQuery) => {
    setQuery(chipQuery);
    performSearch(chipQuery);
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Helmet>
          <title>BestDish Bangalore - Find Top Rated Food</title>
          <meta name="description" content="Discover the best dishes and top-rated restaurants in Bangalore. Search by dish name and find verified reviews." />
          <meta property="og:title" content="BestDish Bangalore" />
          <meta property="og:description" content="Find the best dishes in Bangalore." />
        </Helmet>

        <header className="pt-20 pb-10 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 tracking-tight">
            Best<span className="text-electric-orange">Dish</span> Bangalore
          </h1>
          <SearchBar
            value={query}
            onChange={setQuery}
            onSearch={() => performSearch(query)}
          />

          <div className="mt-8 flex gap-3 overflow-x-auto justify-center pb-2 hide-scrollbar">
            {filterChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleChipClick(chip.query)}
                className="bg-white border border-gray-200 px-6 py-2 rounded-full whitespace-nowrap text-gray-600 hover:border-electric-orange hover:text-electric-orange transition-colors font-medium shadow-sm"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 pb-20">
          {loading ? (
            <div className="flex justify-center mt-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-orange"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}

              {hasSearched && results.length === 0 && (
                <div className="col-span-full text-center text-gray-500 mt-10">
                  No results found. Try a different dish or cuisine.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </HelmetProvider>
  );
}

export default App;
