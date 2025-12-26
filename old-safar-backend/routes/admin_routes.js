const AdminController = require("../src/controllers/admin_controller");
const {
  authorizeAdmin,
  SuperAdminMiddleware,
} = require("../middlewares/token.middleware");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {
  registerMiddleware,
  loginMiddleware,
} = require("../middlewares/auth.middleware");
const {
  createVehicleController,
  getFilteredVehiclesController,
  getVehiclesController,
  updateVehicleController,
} = require("../src/controllers/vehicle_controller");

router.post(
  "/auth/register",

  authorizeAdmin,
  SuperAdminMiddleware,
  registerMiddleware,
  AdminController.RegisterAdmin
);
router.patch(
  "/change-password",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.UpdatePassword
);
router.patch(
  "/toggle-admin-role",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.ToggleAdminRole
);
router.delete(
  "/delete-admin/:id",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.DeleteAdmin
);
router.post("/auth/login", loginMiddleware, AdminController.LoginAdmin);
router.get(
  "/get-all-admin",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.GetAllAdmins
);
router.post(
  "/category",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.addNewCategory
);

router.post(
  "/itinerary",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.addNewItinerary
);

router.put(
  "/categories-order",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.EditCategoryOrderByIndexUpdate
);

router.put(
  "/category/:id",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.EditCategoryById
);

// For enquiry
router.get(
  "/enquiries",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.GetAllEnquiries
);
router.get(
  "/customize-enquiries",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.GetAllCustomizeEnquiries
);
router.get(
  "/instalink-enquiries",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.GetAllInstalinkEnquiries
);
router.put(
  "/leads/remark",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.UpdateLeadRemark
);
router.put(
  "/itinerary/:id",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.EditItineraryById
);
router.get(
  "/dashboard",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.GetDashboardData
);
router.post(
  "/banner",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.AddOfferBanner
);
router.patch(
  "/home_categories",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.UpdateHomePageCategory
);

router.patch(
  "/batch/:id",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.MarkBatchSold
);
router.patch(
  "/update_hero_itin",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.UpdateHeroItin
);

router.patch(
  "/update_request_status",
  authorizeAdmin,
  AdminController.UpdateRequestStatus
);

router.get("/get_requests", authorizeAdmin, AdminController.GetRequests);
router.patch(
  "/toggle-itinerary-active/:id",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.toggleItinerariesActiveOrInactive
);
router.put(
  "/update-offer-headline",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.UpdateOfferHeadline
);

router.put(
  "/update-terms",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.UpdateTermsConditions
);
router.put(
  "/update-gallery",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.UpdateGalleryImages
);
router.delete(
  "/delete-image/:id",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.DeleteTravelGalleryImage
);
router.get(
  "/get-contents",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.GetContentsPageData
);
router.patch(
  "/toggle-trending",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.ToggleTrendingItinerary
);

router.get("/get-all-bookings", authorizeAdmin, AdminController.GetAllBookings);
router.get("/get-booking/:id", authorizeAdmin, AdminController.GetBookingById);

router.delete(
  "/category/:id",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.DeleterCategoryById
);
router.delete(
  "/itinerary/:id",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.PartiallyDeleteItinerary
);

router.patch(
  "/nav_categories",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.UpdateNavCategories
);

router.put(
  "/cancellation_policy",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.UpdateCancellationPolicy
);
router.get(
  "/get-all-itin-names",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.GetAllItinNames
);
router.delete("/banner/:id", authorizeAdmin, AdminController.DeleteBanner);

router.get("/get-vehicles", authorizeAdmin, getVehiclesController);

// Filter + paginate vehicles
router.get("/filter-vehicles", authorizeAdmin, getFilteredVehiclesController);

// Create new vehicle
router.post(
  "/create-vehicle",
  authorizeAdmin,
  SuperAdminMiddleware,
  createVehicleController
);

// Update existing vehicle
router.put(
  "/update-vehicle/:id",
  authorizeAdmin,
  SuperAdminMiddleware,
  updateVehicleController
);
// Hero Slides Management
router.get(
  "/hero-slides",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.ListHeroSlidesAdmin
);
router.post(
  "/hero-slides",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.CreateHeroSlide
);
router.put(
  "/hero-slides/:id",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.UpdateHeroSlide
);
router.delete(
  "/hero-slides/:id",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.DeleteHeroSlide
);
router.post(
  "/locations",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.CreateLocation
);

router.get(
  "/locations",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.ListLocations
);

router.put(
  "/locations/:id",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.UpdateLocation
);

router.delete(
  "/locations/:id",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.DeleteLocation
);

router.put(
  "/locations/:id/itineraries",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.SetLocationItineraries
);

router.put(
  "/locations-order",
  authorizeAdmin,
  SuperAdminMiddleware,
  AdminController.UpdateLocationOrder
);

router.post("/regenerate-category-routes", AdminController.RegenerateCategoryRoutes);

module.exports = router;
