import React from 'react';
import { BadgeCheck } from 'lucide-react';

const VerifiedBadge = () => {
    return (
        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium w-fit mt-1">
            <BadgeCheck size={14} />
            <span>Verified</span>
        </div>
    );
};

export default VerifiedBadge;
