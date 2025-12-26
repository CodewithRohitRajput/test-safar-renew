import React, { useEffect, useRef } from 'react';

const ReviewSearchableSelect = ({
  searchTerm,
  onSearchChange,
  isDropdownOpen,
  onDropdownOpenChange,
  itineraries,
  onItinerarySelect,
  onItineraryClear,
  selectedId
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onDropdownOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onDropdownOpenChange]);

  const filteredItineraries = itineraries.filter(itinerary => 
    itinerary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    itinerary.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full relative searchable-select" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Itinerary
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="Search itineraries..."
          value={searchTerm}
          onChange={(e) => {
            onSearchChange(e.target.value);
            onDropdownOpenChange(true);
          }}
          onFocus={() => onDropdownOpenChange(true)}
          className="w-full  px-4 py-2.5 text-gray-700 bg-white border border-gray-300 
            rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
            transition-all duration-200 ease-in-out
            hover:border-orange-400
            text-sm"
        />
        {selectedId && (
          <button
            onClick={onItineraryClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>
      
      {isDropdownOpen && (
        <div className=" w-full overflow-hidden">
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredItineraries.length > 0 ? (
            filteredItineraries.map(itinerary => (
              <div
                key={itinerary.id}
                onClick={() => {
                  onItinerarySelect(itinerary);
                  onDropdownOpenChange(false);
                }}
                className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700
                  transition-colors duration-150 ease-in-out"
              >
                <div className="font-medium">{itinerary.title}</div>
                <div className="text-gray-500 text-xs">{itinerary.city}</div>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">No itineraries found</div>
          )}
        </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSearchableSelect;