"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnquiries } from '@/lib/thunks/fetchEnquiries';
import LayoutWrapper from '@/components/LayoutWrapper';
import Enquiries from '@/components/Admin/Enquiries';

function EnquiriesPage() {
  const dispatch = useDispatch();
  const enquiries = useSelector((state) => state.global.enquiries) || [];

  useEffect(() => {
    if (enquiries.length === 0) {
      dispatch(fetchEnquiries());
    }
  }, [dispatch, enquiries.length]);

  return (
    <LayoutWrapper>
      <Enquiries />
    </LayoutWrapper>
  );
}

export default EnquiriesPage;