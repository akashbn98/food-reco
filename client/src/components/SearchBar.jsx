import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, onSearch }) => {
    return (
        <div className="relative w-full max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={24} />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                className="block w-full pl-14 pr-5 py-4 bg-white border border-gray-200 rounded-full text-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electric-orange focus:border-transparent shadow-sm transition-all hover:shadow-md"
                placeholder="What are you craving today?"
            />
            <button
                onClick={onSearch}
                className="absolute inset-y-1.5 right-1.5 bg-electric-orange text-white rounded-full px-6 font-medium hover:bg-orange-600 transition-colors"
            >
                Find
            </button>
        </div>
    );
};

export default SearchBar;
