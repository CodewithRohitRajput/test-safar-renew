"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchHomeCategories } from "@/lib/thunks/fetchHomeCategories";
import { fetchBanner } from "@/lib/thunks/fetchBanner";
import { fetchCategoriesAndItineraries } from "@/lib/thunks/fetchCategoriesAndItineraries ";
import { fetchGalleryImages } from "@/lib/thunks/fetchGalleryImages";

import NewHeroSectionDemo from "./User/HomePage/HeroSectionNew/NewHeroSectionDemo";
import CategorySection from "./User/HomePage/categorySection/CategorySection";
import ItineraryPSection from "./User/HomePage/itenerarySection/IteneraySection";
import BannerSlider from "./User/HomePage/banners/BannerSlider";
import TripsPage from "./User/HomePage/tripSection/TripPage";
import JourneySection from "./User/HomePage/journeysection/JourneySection";
import Gallery from "./User/HomePage/galaryView/GalaryView";
import Testimonial from './User/HomePage/reviewSection/ReviewSection'

import { fetchTermAndCondition } from "@/lib/thunks/fetchTermAndCondition";
import { fetchHeroSlides } from "@/lib/thunks/fetchHeroSlides";
// Head import removed as it was unused


function Home() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.global.homeCategories) || [];

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchHomeCategories());
    }
    dispatch(fetchBanner());
    dispatch(fetchTermAndCondition());
    dispatch(fetchCategoriesAndItineraries());
    dispatch(fetchGalleryImages());
    dispatch(fetchHeroSlides());
  }, [dispatch, categories.length]);

  return (
    <div className="w-full">
       <h1 className="hidden">Safar Wanderlust</h1>
        <NewHeroSectionDemo />
       <CategorySection />
       <ItineraryPSection />
       <BannerSlider />
       <TripsPage />
      <JourneySection />
      <Gallery />
     <Testimonial />
    
    </div>
  );
}

export default Home;
