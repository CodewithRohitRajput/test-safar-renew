"use client"

import { useDispatch, useSelector } from 'react-redux'
import { setDilougeVisibllity, setValue } from '@/lib/globalSlice'

export const showConfirmationDialog = (dispatch) => {
    return new Promise((resolve) => {
      const userConfirmed = window.confirm("Are you sure you want to delete this category? This action cannot be undone.")
      resolve(userConfirmed)
    })
  }

  export const ConfirmationDialog = () => {
  console.log("in showConfirmationDialog method");

  return new Promise((resolve) => {
    const userConfirmed = window.confirm("Do you want to proceed?");
    resolve(userConfirmed);
  });
};