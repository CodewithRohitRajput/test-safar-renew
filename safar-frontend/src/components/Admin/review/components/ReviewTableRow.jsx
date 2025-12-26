import React from 'react';
import moment from 'moment';
import Checkbox from '@mui/material/Checkbox';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';

const ReviewTableRow = ({ review, onEdit, onDelete, onLandingPageChange }) => {
  console.log(onEdit)
  return (
    <tr className="border-b border-gray-100">
      <td className="py-4">
        <div className="flex items-center">
          <div className="h-8 w-8">
            <img 
              className="h-8 w-8 rounded-full object-cover" 
              src={review.reviewer_image} 
              alt={review.reviewer_name} 
            />
          </div>
          <div className="ml-3">
            <div className="text-sm text-gray-900">
              {review.reviewer_name}
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 text-sm">{review.rating}/5</td>
      <td className="py-4">
        <Checkbox
          checked={review.isLandingPage}
          onChange={(e) => onLandingPageChange(review.id, e.target.checked)}
          size="small"
          sx={{
            color: '#F47521',
            '&.Mui-checked': {
              color: '#F47521',
            },
          }}
        />
      </td>
      <td className="py-4 text-sm text-gray-500">
        {moment(review.createdAt).format('MMM DD, YYYY')}
      </td>
      <td className="py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onEdit(review)}
            className="text-[#F47521] hover:opacity-80"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(review.id)}
            className="text-[#F47521] hover:opacity-80"
          >
            <RiDeleteBin6Line className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ReviewTableRow;