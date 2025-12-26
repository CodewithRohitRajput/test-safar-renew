import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import { RxCross2 } from 'react-icons/rx';
import ReviewSearchableSelect from './ReviewSearchableSelect';
import { MODAL_PURPOSES } from '../constants/reviewConstants';
import { validateReview } from '../schemas/reviewSchema';

const ReviewModal = ({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
  modalPurpose,
  searchableSelect
}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setTouched({});
    }
  }, [isOpen]);

  const handleBlur = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
    
    // Validate the entire form but only show error for this field
    const { errors: validationErrors } = validateReview(formData);
    if (validationErrors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: validationErrors[fieldName]
      }));
    }
  };

  const handleChange = (field, value) => {
    onChange(field, value);
    
    if (touched[field]) {
      const { errors: validationErrors } = validateReview({
        ...formData,
        [field]: value
      });
      setErrors(prev => ({
        ...prev,
        [field]: validationErrors[field]
      }));
    }
  };

  const handleSubmit = () => {
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);

    // Validate all fields
    const { success, errors: validationErrors } = validateReview(formData);
    setErrors(validationErrors);

    if (success) {
      onSubmit();
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] ? errors[fieldName] : undefined;
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="review-modal"
    >
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30"> 
         <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-[800px] max-h-[90vh] overflow-y-auto outline-none">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            {modalPurpose === MODAL_PURPOSES.ADD ? 'Add Review' : 'Edit Review'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RxCross2 size={24} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="p-6 space-y-6">
          {/* Reviewer Name */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reviewer Name
            </label>
            <input
              type="text"
              value={formData.reviewer_name}
              onChange={(e) => handleChange('reviewer_name', e.target.value)}
              onBlur={() => handleBlur('reviewer_name')}
              className={`w-full px-4 py-2.5 text-gray-700 bg-white border 
                rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500
                transition-all duration-200 ease-in-out
                ${getFieldError('reviewer_name') ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter reviewer's name"
            />
            {getFieldError('reviewer_name') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('reviewer_name')}</p>
            )}
          </div>

          {/* Reviewer Image */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reviewer Image URL
            </label>
            <input
              type="text"
              value={formData.reviewer_image}
              onChange={(e) => handleChange('reviewer_image', e.target.value)}
              onBlur={() => handleBlur('reviewer_image')}
              className={`w-full px-4 py-2.5 text-gray-700 bg-white border 
                rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500
                transition-all duration-200 ease-in-out
                ${getFieldError('reviewer_image') ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter image URL"
            />
            {getFieldError('reviewer_image') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('reviewer_image')}</p>
            )}
          </div>

          {/* Review Text */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review Text
            </label>
            <textarea
              value={formData.review_text}
              onChange={(e) => handleChange('review_text', e.target.value)}
              onBlur={() => handleBlur('review_text')}
              rows={4}
              className={`w-full px-4 py-2.5 text-gray-700 bg-white border 
                rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500
                transition-all duration-200 ease-in-out resize-none
                ${getFieldError('review_text') ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter review text"
            />
            {getFieldError('review_text') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('review_text')}</p>
            )}
          </div>

          {/* Rating */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleChange('rating', star)}
                  onBlur={() => handleBlur('rating')}
                  className={`text-2xl focus:outline-none transition-colors
                    ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
            {getFieldError('rating') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('rating')}</p>
            )}
          </div>

          {/* Itinerary Selection */}
          <ReviewSearchableSelect {...searchableSelect} />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
              rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 
              rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {modalPurpose === MODAL_PURPOSES.ADD ? 'Create Review' : 'Update Review'}
          </button>
        </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewModal;
