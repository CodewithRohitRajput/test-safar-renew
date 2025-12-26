"use client"

import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useRouter } from 'next/navigation';
import { setValue } from '@/lib/globalSlice';
import { get, post, put, remove } from '../../../../constants/axiosClient';
import { API_ENDPOINTS } from '../../../../constants/apiEndpoints';
import { PAGES } from '../../../../constants/PagesName';
import { localStorageHelper } from '../../../../helper/storageHelper';

export const useReviews = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleError = (error) => {
    dispatch(setValue({ key: 'to_show_loader', value: false }));
    console.error(error);
    const err_response = error?.response?.data;
    if (err_response?.success === false && err_response?.message === 'VALIDATION_INVALID_TOKEN') {
      localStorageHelper.removeItem('login_data');
      router.push(PAGES.LOGIN, { replace: true });
    }
  };

  const fetchReviews = async (page = 1) => {
    dispatch(setValue({ key: 'to_show_loader', value: true }));
    try {
      const updated_api = `${API_ENDPOINTS.REVIEWS.GET_ALL_REVIEWS}?page=${page}&limit=10`;
      
      const response = await get(updated_api);
      if (response?.message === 'REVIEWS_FETCHED' && response?.success === true) {
        const processedReviews = response?.data?.reviews.map(review => ({
          ...review,
          isLandingPage: review.isLandingPage === true || review.isLandingPage === 1
        }));
        
        return {
          reviews: processedReviews,
          totalPages: response?.data?.totalPages,
          currentPage: page
        };
      }
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      dispatch(setValue({ key: 'to_show_loader', value: false }));
    }
  };

  const createReview = async (reviewData) => {
    dispatch(setValue({ key: 'to_show_loader', value: true }));
    try {
      const response = await post(API_ENDPOINTS.REVIEWS.CREATE_REVIEW, reviewData);
      return response?.success;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      dispatch(setValue({ key: 'to_show_loader', value: false }));
    }
  };

  const updateReview = async (id, reviewData) => {
    dispatch(setValue({ key: 'to_show_loader', value: true }));
    try {
      const response = await put(`${API_ENDPOINTS.REVIEWS.UPDATE_REVIEW}/${id}`, reviewData);
      return response?.success;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      dispatch(setValue({ key: 'to_show_loader', value: false }));
    }
  };

  const deleteReview = async (id) => {
    dispatch(setValue({ key: 'to_show_loader', value: true }));
    try {
      const response = await remove(`${API_ENDPOINTS.REVIEWS.DELETE_REVIEW}/${id}`);
      return response?.success;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      dispatch(setValue({ key: 'to_show_loader', value: false }));
    }
  };

  return {
    fetchReviews,
    createReview,
    updateReview,
    deleteReview
  };
};