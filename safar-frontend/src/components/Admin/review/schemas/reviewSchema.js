import { z } from 'zod';

export const reviewSchema = z.object({
  reviewer_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .nonempty('Reviewer name is required'),
  
  reviewer_image: z
    .string()
    .nonempty('Image URL is required')
    .url('Please enter a valid URL'),
  
  review_text: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review must not exceed 1000 characters')
    .nonempty('Review text is required'),
  
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must not exceed 5'),
  
  itineraryId: z
    .string()
    .nullable()
});

export const validateReview = (data) => {
  try {
    reviewSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { success: false, errors };
  }
}; 