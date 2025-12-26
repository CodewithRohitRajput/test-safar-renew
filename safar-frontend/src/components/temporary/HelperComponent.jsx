"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import { fetchItenerayByName } from "@/lib/thunks/fetchItenerayByName";
import CustomModal from "@/components/CustomModal";
import BannerSlider from "@/components/User/HomePage/banners/BannerSlider";
import ReviewSection from "@/components/User/HomePage/reviewSection/ReviewSection";
import PartnersSection from "@/components/User/explorePage/PartnersSection";
import FeaturesIcons from "@/components/User/itineraryPage/featureIcons";
import ItenerayImageSection from "@/components/User/itineraryPage/itenerayImageSection";
import ItinerarySection from "@/components/User/itineraryPage/ItinerarySection";
import PricingComponent from "@/components/User/itineraryPage/PricingSection";
import TripPdfDownloadBanner from "@/components/User/itineraryPage/TripPdfDownloadBanner";
import { useParams } from "next/navigation";
import TravellerForm from "@/components/User/itineraryPage/TravellerForm";

const ItineraryPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;
  const iteneray = useSelector((state) => state.global.itenerayByID) || [];

  const [showCallBackForm, setShowCallBackForm] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const [selectedBatch, setSelectedBatch] = useState('')
  const [selectedPackage, setSelectedPackage] = useState(null) // State for selected package
  const [selectedStartingPoint, setSelectedStartingPoint] = useState(null) // State for full selected starting point object
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState(null) // State for full selected dropping point object
  
  function openPopup()
  {
     setIsPopupOpen((prev)=> !prev);
  }
  const closePopup = () => {
    setIsPopupOpen(false) // Close popup
    setShowCallBackForm(true)
  }
  useEffect(() => {
    if (id) {
      dispatch(fetchItenerayByName(id));
      console.log("Fetched data for ID:", id);
    }
  }, [dispatch, id]);

  return (
    <div>
      {/* <Head>
        <title>{iteneray.title || "Itinerary Details"} - Safar Wanderlust</title>
        <meta
          name="description"
          content={
            iteneray.description ||
            "Explore detailed itineraries for your dream destinations with Safar Wanderlust."
          }
        />
        <meta property="og:title" content={iteneray.title || "Itinerary Details"} />
        <meta property="og:url" content={`https://yourdomain.com/itinerary/${id}`} />
      </Head> */}

      {/* Image & Feature Icons Section */}
      <ItenerayImageSection
        allImages={iteneray.allImages}
        title={iteneray.title}
        description={iteneray.description}
        city={iteneray.city}
      />
      <FeaturesIcons
        altitude={iteneray.altitude}
        cultural_sites={iteneray.cultural_sites}
        duration={iteneray.duration}
        scenery={iteneray.scenery}
      />

      {/* Main Content Layout */}
      <div className="grid lg:grid-cols-[65%_35%]   ">
        {/* Left Content Section */}
        <div className="  ">
          <ItinerarySection
            notes={iteneray.notes}
            dayDetails={iteneray.day_details}
            hotels={iteneray.hotels}
            inclusions_exclusions={iteneray.inclusions_exclusions}
            cancellation_policy={iteneray.cancellation_policy}
          />
        </div>

        {/* Right Pricing Section (Sticky + Scrollable) */}
        <div className="   justify-start   md:p-2 sticky top-0 h-full md:h-max  flex flex-col bg-gray-900 shadow-lg ">
          {/* Pricing Component md:px-16 */}
          <PricingComponent
           openPopup={openPopup}
            selectedBatch={selectedBatch}
            showCallBackForm={showCallBackForm}
            setShowCallBackForm={setShowCallBackForm}
            selectedDroppingPoint={selectedDroppingPoint}
            selectedPackage={selectedPackage}
            selectedStartingPoint={selectedStartingPoint}
            setSelectedBatch={setSelectedBatch}
            setSelectedDroppingPoint={setSelectedDroppingPoint}
            setSelectedPackage={setSelectedPackage}
            setSelectedStartingPoint={setSelectedStartingPoint}
            base_packages={iteneray.base_packages}
            batches={iteneray.batches}
            drop_point={iteneray.drop_point}
            pickup_point={iteneray.pickup_point}
          />

          {/* Trip PDF Download Banner at Bottom */}
          <div className="flex flex-col justify-center items-center ">
            <TripPdfDownloadBanner pdfLink={iteneray.itin_pdf} />
          </div>
        </div>
      </div>

      {/* Other Sections */}
      <CustomModal
        open={isPopupOpen}
        handleClose={() => setIsPopupOpen(false)}
        title={<span>Add Traveller Information</span>}
        description = "The information you fill below is needed to quote and book your trip."
        restContent={   
        <div className="w-[65vw] max-w-screen-xl ">
            <TravellerForm
              isOpen={isPopupOpen}
              onClose={closePopup}
              base_packages={iteneray.base_packages}
              drop_point={iteneray.drop_point}
              pickup_point={iteneray.pickup_point}
              selectedBatch={selectedBatch}
              selectedDroppingPoint={selectedDroppingPoint}
              selectedPackage={selectedPackage}
              selectedStartingPoint={selectedStartingPoint}
            />
          </div>}
      />
      <BannerSlider />
      {iteneray && <ReviewSection page="itinerary" itineraryId={iteneray.id} />}
    </div>
  );
};

export default ItineraryPage;
