"use client";

import React, { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import Toggle from "@/components/TogelButton";
import OfferBar from "./OfferBar";
import SearchBar from "./SearchBar";
import TripForm from "./TripForm";
import CustomModal from "@/components/CustomModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchNavbarCategories } from "@/lib/thunks/fetchNavBarCategories";
import { fetchTrendingItineraries } from "@/lib/thunks/fetchTrendingItineraries";
import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CustomLogo from "./CustomLogo";
import SimpleCategoryDropdown from "../components/SimpleCategoryDropdown";
import SimpleTrendingDropdown from "../components/SimpleTrendingDropdown";

const Navbar = () => {
  const router = useRouter();

  const [state, setState] = useState({
    isToggled: false,
    expanded: false,
    expandedMobile: false,
    isDropdownOpen: false,
    showForm: false,
    isTreddingDropdownOpen: false,
    isSticky: false,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNavbarCategories());
    dispatch(fetchTrendingItineraries());

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setState((prevState) => ({ ...prevState, isSticky: true }));
      } else {
        setState((prevState) => ({ ...prevState, isSticky: false }));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch]);

  const navBarCategories =
    useSelector((state) => state.global.NavBarCategories) || [];
  const allCategories =
    useSelector((state) => state.global.categories) || [];
  const trendingItineraries =
    useSelector((state) => state.global.trendingItineraries) || [];

  // Use navBarCategories if available, otherwise use allCategories
  const categoriesToShow = navBarCategories.length > 0 ? navBarCategories : allCategories;

  const handleToggle = () => {
    setState((prevState) => ({
      ...prevState,
      showForm: !prevState.showForm,
      isToggled: !prevState.isToggled,
    }));
  };

  const toggleExploreDropdown = (e) => {
    e.preventDefault(); // Prevent navigation
    setState((prevState) => ({
      ...prevState,
      isDropdownOpen: !prevState.isDropdownOpen,
      isTreddingDropdownOpen: false, // Close trending dropdown
    }));
  };

  const toggleTrendingDropdown = (e) => {
    e.preventDefault(); // Prevent navigation
    setState((prevState) => ({
      ...prevState,
      isTreddingDropdownOpen: !prevState.isTreddingDropdownOpen,
      isDropdownOpen: false, // Close explore dropdown
    }));
  };

  return (
    <>
      <OfferBar />
      <div className="bg-white z-50 mx-14 border-b border-gray-300 sm:block md:block hidden">
        <div className="mx-auto flex flex-col justify-between ">
          <div className="flex pt-3 pb-3 border-gray-400 items-center justify-between">
            <div onClick={() => router.push("/")}>
              <CustomLogo />
            </div>
            <div className="w-full max-w-2xl">
              <SearchBar
                expanded={state.expanded}
                setExpanded={(value) =>
                  setState((prevState) => ({ ...prevState, expanded: value }))
                }
              />
            </div>
            <div className="flex items-center mr-5">
              {/* Location placeholder */}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Navbar with sticky */}
      {/* <nav
        className={`sticky top-5 z-[99] bg-white transition-all sm:block md:block hidden ${
          state.isSticky
            ? "shadow-md rounded-full mx-[11%] "
            : "px-14 border-b-[1px] py-2"
        }`}
      > */}
      {/* Sticky Navbar without sticky */}
      <nav
        className="z-[99] bg-white transition-all sm:block md:block hidden px-14 border-b-[1px] py-2"
      >
        <div className="flex pl-1 h-full pr-1  items-center justify-between space-6">
          <div className="pl-4 h-full flex items-center gap-14">
            {/* {state.isSticky && (
              <div onClick={() => router.push("/")}>
                <CustomLogo logoOnly={true} imageStyle="md:h-11 md:w-9" />
              </div>
            )} */}

            {/* Trending with Arrow - FIRST POSITION */}
            <div className="relative">
              <div className="flex items-center space-x-1">
                <button
                  onClick={toggleTrendingDropdown}
                  className="text-gray-800 font-nunitobold700 tracking-wide text-[16px] hover:text-orange-500 transition-colors flex items-center space-x-1"
                >
                  <span>Trending</span>
                  <IoIosArrowDown 
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                      state.isTreddingDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {state.isTreddingDropdownOpen && (
                <div
                  className={`absolute bg-white shadow-xl border border-gray-100 rounded-lg z-[99] transition-all duration-300 ease-in-out transform ${
                    state.isTreddingDropdownOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2"
                    } ${
                    state.isSticky
                      ? "w-[250px] top-8 left-0"
                      : "w-[250px] top-8 left-0"
                  }`}
                  onMouseEnter={() =>
                    setState((prevState) => ({
                      ...prevState,
                      isTreddingDropdownOpen: true,
                    }))
                  }
                  onMouseLeave={() =>
                    setState((prevState) => ({
                      ...prevState,
                      isTreddingDropdownOpen: false,
                    }))
                  }
                >
                  <SimpleTrendingDropdown 
                    itineraries={trendingItineraries}
                    setState={setState}
                  />
                </div>
              )}
            </div>

            {/* Explore with Arrow - SECOND POSITION */}
            <div className="relative">
              <div className="flex items-center space-x-1">
                <button
                  onClick={toggleExploreDropdown}
                  className="text-gray-800 font-nunitobold700 tracking-wide text-[16px] hover:text-orange-500 transition-colors flex items-center space-x-1"
                >
                  <span>Explore</span>
                  <IoIosArrowDown 
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                      state.isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {state.isDropdownOpen && (
                <div
                  className={`absolute bg-white shadow-xl border border-gray-100 rounded-lg z-[99] transition-all duration-300 ease-in-out transform ${
                    state.isDropdownOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2"
                  } ${
                    state.isSticky
                      ? "w-[200px] top-8 left-0"
                      : "w-[200px] top-8 left-0"
                  }`}
                  onMouseEnter={() =>
                    setState((prevState) => ({
                      ...prevState,
                      isDropdownOpen: true,
                    }))
                  }
                  onMouseLeave={() =>
                    setState((prevState) => ({
                      ...prevState,
                      isDropdownOpen: false,
                    }))
                  }
                >
                  <SimpleCategoryDropdown 
                    categories={categoriesToShow}
                    setState={setState}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="mr-3 text-gray-800 font-nunitobold700 tracking-wide text-[16px] hover:text-orange-500 transition-colors">
              Customize Trip
            </span>
            <Toggle enabled={state.isToggled} onToggle={handleToggle} />
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <div className="md:hidden sm:hidden flex justify-between  items-center px-5 ">
        <div onClick={() => router.push("/")}>
          <CustomLogo logoOnly={true} className="w-full" />
        </div>
        <div className="flex w-full items-center justify-end">
          <div
            className="mx-4"
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                expandedMobile: true,
              }))
            }
          >
            <GoSearch size={23} />
          </div>
          <CustomModal
            padding={3}
            open={state.expandedMobile}
            restContent={
              <div className=" relative w-[65vw] ">
                <div className="absolute -right-5 -top-5 z-[999] ">
                  <div
                    className="p-2"
                    onClick={() => {
                      setState((prevState) => ({
                        ...prevState,
                        expandedMobile: false,
                      }));
                    }}
                  >
                    <RxCross2 size={30} color="black" />
                  </div>
                </div>
                <SearchBar
                  expanded={state.expandedMobile}
                  setExpanded={(value) =>
                    setState((prevState) => ({
                      ...prevState,
                      expandedMobile: value,
                    }))
                  }
                />
              </div>
            }
          />
          <div className=" overflow-hidden">
            {/* Mobile menu placeholder */}
          </div>
        </div>
      </div>

      {/* Customize Trip Modal */}
      <CustomModal
        padding={4}
        modalSize="medium"
        title={
          <h1 className="md:text-4xl text-xl text-center mb-2">
            Customize <span className="text-black font-bold">Trip</span> 🔥
          </h1>
        }
        description={
          <p className="text-center md:w-[50%] mx-auto mb-6 text-gray-600">
            Tailor your journey with personalized itineraries, activities, and
            experiences.
          </p>
        }
        open={state.showForm}
        handleClose={() =>
          setState((prevState) => ({
            ...prevState,
            showForm: false,
            isToggled: false,
          }))
        }
        restContent={
          <div className="w-[60vw]">
            <TripForm state={state} setState={setState} />
          </div>
        }
      />
    </>
  );
};

export default Navbar;