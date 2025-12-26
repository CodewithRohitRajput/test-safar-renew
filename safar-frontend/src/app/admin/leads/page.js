"use client";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstalinkEnquiries } from '@/lib/thunks/fetchInstalinkEnquiries';
import LayoutWrapper from '@/components/LayoutWrapper';
import Leads from '@/components/Admin/Leads';

function LeadsPage() {
  const dispatch = useDispatch();
  const instalinkEnquiries = useSelector((state) => state.global.instalinkEnquiries) || [];

  useEffect(() => {
    if (instalinkEnquiries.length === 0) {
      dispatch(fetchInstalinkEnquiries());
    }
  }, [dispatch, instalinkEnquiries.length]);

  return (
    <LayoutWrapper>
      <Leads />
    </LayoutWrapper>
  );
}

export default LeadsPage;