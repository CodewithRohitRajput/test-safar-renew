// --- ReviewTable.jsx ---

import React, { useState } from 'react';

const ReviewTable = ({ 
  reviews, 
  onEdit, 
  onDelete, 
  onLandingPageChange,
  isLoading,
  itineraries,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterRating, setFilterRating] = useState('');

  const getItineraryName = (id) => {
    const itinerary = itineraries.find((item) => item.id === id);
    return itinerary ? `${itinerary.title} - ${itinerary.city}` : '—';
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    if (sortOrder === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  const filteredReviews = sortedReviews.filter((review) => {
    return filterRating ? review.rating === Number(filterRating) : true;
  });

  return (
    <div className="mt-8">
      <div className="flex justify-end gap-4 mb-4">
        <div>
          <label className="text-sm font-medium mr-2">Filter by Rating:</label>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="border px-3 py-1 rounded text-sm"
          >
            <option value="">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>

      <table className="min-w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th
              onClick={() => handleSort('reviewer_name')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Reviewer {sortField === 'reviewer_name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Text
            </th>
            <th
              onClick={() => handleSort('rating')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Rating {sortField === 'rating' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Itinerary
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredReviews.map((review) => (
            <tr key={review.id} className="border-t border-gray-200">
              <td className="px-4 py-2">{review.reviewer_name}</td>
              <td className="px-4 py-2">{review.text}</td>
              <td className="px-4 py-2">{review.rating}</td>
              <td className="px-4 py-2 text-sm text-gray-600">
                {getItineraryName(review.itineraryId)}
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => onEdit(review)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => onDelete(review.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F47521]" />
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="px-4 py-2 text-sm bg-[#F47521] text-white rounded-lg hover:bg-[#e06b1d] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === page
                  ? 'bg-[#F47521] text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              disabled={isLoading}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="px-4 py-2 text-sm bg-[#F47521] text-white rounded-lg hover:bg-[#e06b1d] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReviewTable;
