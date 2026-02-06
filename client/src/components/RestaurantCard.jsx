import React from 'react';
import { Star, MapPin } from 'lucide-react';
import VerifiedBadge from './VerifiedBadge';
import { motion } from 'framer-motion';

const RestaurantCard = ({ restaurant }) => {
    const { name, rating, location, cuisine, area } = restaurant;
    const isVerified = parseFloat(rating) >= 4.5;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow"
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800 leading-tight">{name}</h3>
                <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
                    <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-sm font-bold text-gray-700">{rating}</span>
                </div>
            </div>

            {isVerified && <VerifiedBadge />}

            <div className="mt-auto pt-3 text-sm text-gray-500 space-y-1">
                <p className="flex items-center">
                    <span className="font-medium text-gray-400 capitalize">{cuisine}</span>
                </p>
                <div className="flex items-start mt-2 text-xs text-gray-400">
                    <MapPin size={14} className="mr-1 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{location}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default RestaurantCard;
