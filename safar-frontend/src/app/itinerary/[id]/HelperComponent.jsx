"use client";
import { useEffect, useState, useRef } from "react";
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
import CustomCallBackReq from "@/components/User/components/CustomCallBackForm";
import MobileStickyPriceBar from "@/components/User/itineraryPage/MobileStickyPriceBar";

// A simple loader component
const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <p className="text-2xl font-semibold">Loading itinerary...</p>
  </div>
);

const ItineraryPage = ({ ldData }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;
  const pricingSectionRef = useRef(null);
  const pricingComponentRef = useRef(null);

  const iteneray = useSelector((state) => state.global.itenerayByID) || {};

  const [isLoading, setIsLoading] = useState(true);
  const [showCallBackForm, setShowCallBackForm] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showPriceBar, setShowPriceBar] = useState(true);
  const [triggerValidation, setTriggerValidation] = useState(false);
  const [hasClickedOnce, setHasClickedOnce] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // ADD THIS: Mobile detection state

  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedStartingPoint, setSelectedStartingPoint] = useState(null);
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState(null);

  // ADD THIS: Mobile detection useEffect
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  function openPopup() {
    setIsPopupOpen((prev) => !prev);
  }
  
  const closePopup = () => {
    setIsPopupOpen(false);
    setShowCallBackForm(true);
  };

  // Updated function to scroll to pricing section and trigger validation
  const handleMobileBookNow = () => {
    // On first click, scroll and trigger validation
    if (!hasClickedOnce) {
      setHasClickedOnce(true);
      
      // Scroll to pricing section
      if (pricingSectionRef.current) {
        pricingSectionRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      } else {
        const pricingElement = document.getElementById('pricing-section-mobile');
        if (pricingElement) {
          pricingElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }

      // Trigger validation after scroll
      setTimeout(() => {
        setTriggerValidation(true);
        // Reset trigger after a moment
        setTimeout(() => {
          setTriggerValidation(false);
        }, 100);
      }, 300);
    }

    // Check if all required fields are selected
    if (selectedPackage && selectedBatch && selectedStartingPoint && selectedDroppingPoint) {
      // All fields selected, open popup
      setTimeout(() => {
        openPopup();
      }, hasClickedOnce ? 0 : 800);
    }
  };

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      dispatch(fetchItenerayByName(id))
        .then((response) => {
          console.log("Fetched data for ID:", id, response);
        })
        .catch((error) => {
          console.error("Failed to fetch itinerary:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [dispatch, id]);

  if (isLoading) {
    return <Loader />;
  }

  if (!iteneray || (Object.keys(iteneray).length === 0 && id)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl font-semibold">
          Itinerary not found or data is unavailable.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-0">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ldData),
          }}
        />
      </Head>

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
      <div className="grid lg:grid-cols-[65%_35%]">
        {/* Left Content Section */}
        <div>
          <ItinerarySection
            notes={iteneray.notes}
            dayDetails={iteneray.day_details}
            hotels={iteneray.hotels}
            inclusions_exclusions={iteneray.inclusions_exclusions}
            cancellation_policy={iteneray.cancellation_policy}
          />
        </div>

        {/* Right Pricing Section (Sticky + Scrollable) */}
        <div
          id="pricing-section-mobile"
          ref={pricingSectionRef}
          className="justify-start md:px-16 md:p-2 sticky top-0 h-auto flex flex-col"
          style={{ maxHeight: "100%" }}
        >
          <div className="sticky top-0 overflow-y-clip  ">
            {iteneray?.is_customize ? (
              <>
                <div className="bg-white border-[20px] border-[#1f2937] rounded-xl p-5 shadow-lg w-full">
                  <p className="text-green-600 text-[16px] font-semibold mb-4">
                    This is a Customizable trip. To Customize or Book Please Click On
                    Enquiry Now Button.
                  </p>
                  <button
                    onClick={() => setShowCallBackForm(true)}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-[#FF8D38] to-[#FF5F06] text-white font-semibold text-lg"
                  >
                    Enquiry Now
                  </button>
                </div>

                {showCallBackForm && (
                  <div className="mt-4">
                    <CustomCallBackReq
                      setShowCallBackForm={setShowCallBackForm}
                      itineraryId={id}
                      itineraryTitle={iteneray?.title}
                    />
                  </div>
                )}
              </>
            ) : (
              <PricingComponent
                ref={pricingComponentRef}
                triggerValidation={triggerValidation}
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
                itin_pdf={iteneray.itin_pdf}
                itinerary={iteneray}
              />
            )}
          </div>
        </div>
      </div>

      {/* Other Sections */}
      <CustomModal
        open={isPopupOpen}
        handleClose={() => setIsPopupOpen(false)}
        modalSize="large"
        isMobile={isMobile} // ADD THIS: Pass mobile detection
        title={<span>Add Traveller Information</span>}
        description="The information you fill below is needed to quote and book your trip."
        restContent={
          <div className={`w-full ${isMobile ? 'w-full' : 'w-[65vw] max-w-screen-xl'}`}>
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
          </div>
        }
      />
      <BannerSlider />
      {iteneray && iteneray.id && (
        <ReviewSection page="itinerary" itineraryId={iteneray.id} />
      )}

      {/* Mobile Sticky Price Bar - Hide when modal is open */}
      {!isPopupOpen &&
       !iteneray?.is_customize && 
       iteneray?.base_packages && 
       Array.isArray(iteneray.base_packages) && 
       iteneray.base_packages.length > 0 && (
        <MobileStickyPriceBar
          selectedPackage={selectedPackage}
          base_packages={iteneray.base_packages}
          selectedStartingPoint={selectedStartingPoint}
          selectedDroppingPoint={selectedDroppingPoint}
          selectedBatch={selectedBatch}
          openPopup={openPopup}
          handleSubmit={handleMobileBookNow}
        />
      )}
    </div>
  );
};

export default ItineraryPage;