const { CommonHelper } = require("../../utils/common.helper");
const Constant = require("../../configs/constant");
const AdminServices = require("../services/admin_services");
const { JWTHelper } = require("../../utils/jwt.token.helper");

const RegisterAdmin = async (req, res) => {
  try {
    const admin = await AdminServices.RegisterAdmin(req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "ADMIN_REGISTERED",
      admin
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};
const GetAllAdmins = async (req, res) => {
  try {
    const admin = await AdminServices.GetAllAdmins();
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "ADMIN_FETCHED",
      admin
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const LoginAdmin = async (req, res) => {
  const { password } = req.body;
  const admin = res.admin;
  try {
    const isPasswordMatch = await AdminServices.LoginAdmin({ password, admin });
    if (!isPasswordMatch) {
      return CommonHelper.sendError(
        res,
        false,
        Constant.STATUS_CODE.HTTP_400_BAD_REQUEST,
        "INVALID_PASSWORD",
        []
      );
    }
    const accessToken = JWTHelper.generateToken({ adminId: admin.id }, true);

    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "ADMIN_LOGGED_IN",
      { admin, accessToken }
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};
// model Categories{
//     id          String   @id @default(auto()) @map("_id") @db.ObjectId
//     name        String
//     description String
//     short_description String
//     is_home     String
//     image String
//     keyPoints   KeyPoints[]
//     itinerary   CategoriesOnItineraries[]
//     createdAt   DateTime @default(now())
//     updatedAt   DateTime @updatedAt

//   }

//   model KeyPoints{
//     id          String   @id @default(auto()) @map("_id") @db.ObjectId
//     title        String
//     image       String
//     category    Categories @relation(fields: [categoryId], references: [id])
//     categoryId  String   @db.ObjectId
//   }
const addNewCategory = async (req, res) => {
  try {
    const category = await AdminServices.AddNewCategory(req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "CATEGORY_ADDED",
      category
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err.message.trim().split("\n").pop()
    );
  }
};

//model Itinerary{
//     id          String   @id @default(auto()) @map("_id") @db.ObjectId
//     title       String
//     description String
//     shortDescription String
//     city        String
//     view_images      String[]
//     is_hero   Boolean
//     duration    Int
//     altitude    String
//     scenery     String
//     cultural_sites  String
//     itin_pdf    String
//     day_details DayDetails[]
//     hotels      Hotel[]
//     notes       String[]
//     base_packages  Package[]
//     pickup_point   PickPrice[]
//     drop_point      DropPrice[]
//    batches         Batch[]
//     is_trending     Boolean
//     is_active     Boolean
//     category    CategoriesOnItineraries[]
//     inclusions_exclusions InclusionsExclusions?
//     categoryId  String[]   @db.ObjectId
//     createdAt   DateTime @default(now())
//     updatedAt   DateTime @updatedAt
//   }
const addNewItinerary = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      is_customize,
      city,
      view_images,
      is_hero,
      duration,
      altitude,
      scenery,
      cultural_sites,
      itin_pdf,
      day_details,
      hotels,
      notes,
      base_packages,
      pickup_point,
      drop_point,
      batches,
      is_trending,
      is_active,
      categoryId,
      inclusions_exclusions,
    } = req.body;
    // const itinerary = await prisma.itinerary.create({
    //   data: {
    //     title,
    //     description,
    //     shortDescription,
    //     city,
    //     view_images,
    //     is_hero,
    //     duration,
    //     altitude,
    //     scenery,
    //     cultural_sites,
    //     itin_pdf,
    //     day_details: {
    //       create: day_details.map((day) => ({
    //         day: day.day,
    //         title: day.title,
    //         description: day.description,
    //         activiteis: {
    //           create: day.activiteis.map((activity) => ({
    //             description: activity.description,
    //             images: activity.images,
    //           })),
    //         },
    //       })),
    //     },
    //     hotels: {
    //       create: hotels,
    //     },
    //     notes,
    //     base_packages: {
    //       create: base_packages,
    //     },
    //     pickup_point: {
    //       create: pickup_point,
    //     },
    //     drop_point: {
    //       create: drop_point,
    //     },
    //     batches: {
    //       create: batches,
    //     },
    //     is_trending,
    //     is_active,
    //     categoryId: {
    //       connect: categoryId.map((id) => ({ id })),
    //     },
    //     inclusions_exclusions: {
    //       create: inclusions_exclusions,
    //     },
    //   },
    //   include: {
    //     day_details: {
    //       include: {
    //         activiteis: {
    //           include: true,
    //         },
    //       },
    //     },
    //     hotels: true,
    //     base_packages: true,
    //     pickup_point: true,
    //     drop_point: true,
    //     batches: true,

    //     inclusions_exclusions: true,
    //   },
    // });

    const itinerary = await AdminServices.AddNewItinerary(req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "ITINERARY_ADDED",
      itinerary
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err.message.trim().split("\n").pop()
    );
  }
};

const EditCategoryById = async (req, res) => {
  try {
    const category = await AdminServices.EditCategoryById(req.params, req.body);

    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "CATEGORY_UPDATED",
      category
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};
const EditItineraryById = async (req, res) => {
  try {
    const itinerary = await AdminServices.EditItineraryById(
      req.params,
      req.body
    );

    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "ITINERARY_UPDATED",
      itinerary
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      "ITINERARY_UPDATE_FAILED"
    );
  }
};

const GetDashboardData = async (req, res) => {
  try {
    const response = await AdminServices.GetDashboardData();
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "DASHBOARD_DATA_FETCHED",
      response
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};
const AddOfferBanner = async (req, res) => {
  try {
    const banner = await AdminServices.AddOfferBanner(req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "BANNER_ADDED",
      banner
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const UpdateHomePageCategory = async (req, res) => {
  try {
    const categories = await AdminServices.UpdateHomePageCategory(req.body);

    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "CATEGORIES_UPDATED",
      categories
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const AddSaleOffers = async (req, res) => {
  try {
    const offer = await AdminServices.AddSaleOffers(req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "OFFER_ADDED",
      offer
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};
const MarkBatchSold = async (req, res) => {
  try {
    const batch = await AdminServices.MarkBatchSold(req.params);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "BATCH_MARKED_SOLD",
      batch
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};
const UpdateHeroItin = async (req, res) => {
  try {
    const itin = await AdminServices.UpdateHeroItin(req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "HERO_ITIN_UPDATED",
      itin
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};
const UpdateRequestStatus = async (req, res) => {
  try {
    const request = await AdminServices.UpdateRequestStatus(req.query);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "REQUEST_STATUS_UPDATED",
      request
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const GetRequests = async (req, res) => {
  try {
    const requests = await AdminServices.GetRequests(req.query);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "REQUESTS_FETCHED",
      requests
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};
const toggleItinerariesActiveOrInactive = async (req, res) => {
  try {
    const itineraries = await AdminServices.toggleItinerariesActiveOrInactive(
      req.params
    );
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "ITINERARIES_UPDATED",
      itineraries
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};

const UpdateOfferHeadline = async (req, res) => {
  try {
    const offer = await AdminServices.UpdateOfferHeadline(req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "OFFER_HEADLINE_UPDATED",
      offer
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};
const UpdateTermsConditions = async (req, res) => {
  try {
    const terms = await AdminServices.UpdateTermsConditions(req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "TERMS_UPDATED",
      terms
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};
const UpdateGalleryImages = async (req, res) => {
  try {
    const gallery = await AdminServices.UpdateGalleryImages(req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "GALLERY_UPDATED",
      gallery
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};
const DeleteTravelGalleryImage = async (req, res) => {
  try {
    const gallery = await AdminServices.DeleteTravelGalleryImage(req.params);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "GALLERY_IMAGE_DELETED",
      gallery
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};
const GetContentsPageData = async (req, res) => {
  try {
    const data = await AdminServices.GetContentsPageData();
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "CONTENTS_FETCHED",
      data
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};
const ToggleTrendingItinerary = async (req, res) => {
  try {
    const itin = await AdminServices.ToggleTrendingItinerary(req.query);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "TRENDING_ITIN_UPDATED",
      itin
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      "TRENDING_ITIN_UPDATE_FAILED"
    );
  }
};
const ToggleAdminRole = async (req, res) => {
  try {
    const admin = await AdminServices.ToggleAdminRole(req.query);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "ROLE_UPDATED",
      admin
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      "ROLE_UPDATE_FAILED"
    );
  }
};
const DeleteAdmin = async (req, res) => {
  try {
    const admin = await AdminServices.DeleteAdmin(req.params);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "ADMIN_DELETED",
      admin
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      "ADMIN_DELETE_FAILED"
    );
  }
};
const UpdatePassword = async (req, res) => {
  try {
    const admin = await AdminServices.UpdatePassword(req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "PASSWORD_UPDATED",
      admin
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      "PASSWORD_UPDATE_FAILED"
    );
  }
};

const GetAllBookings = async (req, res) => {
  try {
    const bookings = await AdminServices.GetAllBookings(req.query);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "BOOKINGS_FETCHED",
      bookings
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      "BOOKINGS_FETCH_FAILED"
    );
  }
};
const GetBookingById = async (req, res) => {
  try {
    const booking = await AdminServices.GetBookingById(req.params);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "BOOKING_FETCHED",
      booking
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      "BOOKING_FETCH_FAILED"
    );
  }
};

const DeleterCategoryById = async (req, res) => {
  try {
    const category = await AdminServices.DeleterCategoryById(req.params);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "CATEGORY_DELETED",
      category
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      "CATEGORY_DELETE_FAILED"
    );
  }
};
const PartiallyDeleteItinerary = async (req, res) => {
  try {
    const itinerary = await AdminServices.PartiallyDeleteItinerary(req.params);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "ITINERARY_DELETED",
      itinerary
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      "ITINERARY_DELETE_FAILED"
    );
  }
};
const UpdateNavCategories = async (req, res) => {
  try {
    const categories = await AdminServices.UpdateNavCategories(req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "NAV_CATEGORIES_UPDATED",
      categories
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      "NAV_CATEGORIES_UPDATE_FAILED"
    );
  }
};
const UpdateCancellationPolicy = async (req, res) => {
  try {
    const policy = await AdminServices.UpdateCancellationPolicy(req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "POLICY_UPDATED",
      policy
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      "POLICY_UPDATE_FAILED"
    );
  }
};

const GetAllItinNames = async (req, res) => {
  try {
    const itin = await AdminServices.GetAllItinNames();
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "ITINERARY_NAMES_FETCHED",
      itin
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      "ITINERARY_NAMES_FETCH_FAILED"
    );
  }
};
const DeleteBanner = async (req, res) => {
  try {
    console.log("Trying to delete banner with ID:", req.params.id);
    const banner = await AdminServices.DeleteBanner(req.params);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "BANNER_DELETED",
      banner
    );
  } catch (err) {
    console.log("Backend error while deleting banner:", err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      "BANNER_DELETE_FAILED"
    );
  }
};

const EditCategoryOrderByIndexUpdate = async (req, res) => {
  try {
    const category = await AdminServices.EditCategoryOrderByIndexUpdate(
      req.body
    );
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "CATEGORY_ORDER_UPDATED",
      category
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      "CATEGORY_ORDER_UPDATE_FAILED " + err.message.trim().split("\n").pop()
    );
  }
};

// {ADD For enquiry}
const GetAllEnquiries = async (req, res) => {
  try {
    const response = await AdminServices.GetAllEnquiries();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "INTERNAL_SERVER_ERROR",
      error: error.message,
    });
  }
};

const GetAllCustomizeEnquiries = async (req, res) => {
  try {
    const response = await AdminServices.GetAllCustomizeEnquiries();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "INTERNAL_SERVER_ERROR",
    });
  }
};

const GetAllInstalinkEnquiries = async (req, res) => {
  try {
    const response = await AdminServices.GetAllInstalinkEnquiries();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "INTERNAL_SERVER_ERROR",
    });
  }
};

const CreateHeroSlide = async (req, res) => {
  try {
    const slide = await AdminServices.CreateHeroSlide(req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "HERO_SLIDE_CREATED",
      slide
    );
  } catch (err) {
    return CommonHelper.sendError(res, false, 500, err.message);
  }
};
const UpdateHeroSlide = async (req, res) => {
  try {
    const slide = await AdminServices.UpdateHeroSlide({
      id: req.params.id,
      ...req.body,
    });
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "HERO_SLIDE_UPDATED",
      slide
    );
  } catch (err) {
    return CommonHelper.sendError(res, false, 500, err.message);
  }
};
const DeleteHeroSlide = async (req, res) => {
  try {
    await AdminServices.DeleteHeroSlide({ id: req.params.id });
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "HERO_SLIDE_DELETED",
      true
    );
  } catch (err) {
    return CommonHelper.sendError(res, false, 500, err.message);
  }
};
const ListHeroSlidesAdmin = async (req, res) => {
  try {
    const slides = await AdminServices.ListHeroSlides();
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "HERO_SLIDES_FETCHED",
      slides
    );
  } catch (err) {
    return CommonHelper.sendError(res, false, 500, err.message);
  }
};

const CreateLocation = async (req, res) => {
  try {
    const data = await AdminServices.CreateLocation(req.body);
    return CommonHelper.sendSuccess(res, true, Constant.STATUS_CODE.HTTP_200_OK, "LOCATION_CREATED", data);
  } catch (err) {
    return CommonHelper.sendError(res, false, 500, err.message);
  }
};

const UpdateLocation = async (req, res) => {
  try {
    const data = await AdminServices.UpdateLocation(req.params.id, req.body);
    return CommonHelper.sendSuccess(res, true, Constant.STATUS_CODE.HTTP_200_OK, "LOCATION_UPDATED", data);
  } catch (err) {
    return CommonHelper.sendError(res, false, 500, err.message);
  }
};

const DeleteLocation = async (req, res) => {
  try {
    await AdminServices.DeleteLocation(req.params.id);
    return CommonHelper.sendSuccess(res, true, Constant.STATUS_CODE.HTTP_200_OK, "LOCATION_DELETED", true);
  } catch (err) {
    return CommonHelper.sendError(res, false, 500, err.message);
  }
};

const ListLocations = async (req, res) => {
  try {
    const data = await AdminServices.ListLocations({
      q: req.query.q,
      skip: Number(req.query.skip || 0),
      take: Number(req.query.take || 50),
    });
    return CommonHelper.sendSuccess(res, true, Constant.STATUS_CODE.HTTP_200_OK, "LOCATION_LIST", data);
  } catch (err) {
    return CommonHelper.sendError(res, false, 500, err.message);
  }
};

const SetLocationItineraries = async (req, res) => {
  try {
    const ok = await AdminServices.SetLocationItineraries(req.params.id, req.body.itineraryIds || []);
    return CommonHelper.sendSuccess(res, true, Constant.STATUS_CODE.HTTP_200_OK, "LOCATION_ITINERARIES_SET", ok);
  } catch (err) {
    return CommonHelper.sendError(res, false, 500, err.message);
  }
};

const UpdateLocationOrder = async (req, res) => {
  try {
    const updated = await AdminServices.EditLocationOrderByIndexUpdate(req.body);
    return CommonHelper.sendSuccess(res, true, Constant.STATUS_CODE.HTTP_200_OK, "LOCATION_ORDER_UPDATED", updated);
  } catch (err) {
    return CommonHelper.sendError(res, false, 500, err.message);
  }
};
const UpdateLeadRemark = async (req, res) => {
  try {
    const { leadId, remark } = req.body;
    const response = await AdminServices.UpdateLeadRemark(leadId, remark);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "INTERNAL_SERVER_ERROR",
    });
  }
};

const RegenerateCategoryRoutes = async (req, res) => {
  try {
    const { GenerateRouteforAllCategories } = require("../../utils/cronjobs");
    const result = await GenerateRouteforAllCategories();
    
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "ROUTES_REGENERATED",
      result
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err
    );
  }
};

module.exports = {
  toggleItinerariesActiveOrInactive,
  RegisterAdmin,
  DeleteAdmin,
  LoginAdmin,
  addNewCategory,
  addNewItinerary,
  EditCategoryById,
  EditItineraryById,
  GetDashboardData,
  AddOfferBanner,
  UpdateHomePageCategory,
  MarkBatchSold,
  UpdateHeroItin,
  UpdateRequestStatus,
  GetRequests,
  UpdateOfferHeadline,
  UpdateTermsConditions,
  UpdateGalleryImages,
  DeleteTravelGalleryImage,
  GetContentsPageData,
  ToggleTrendingItinerary,
  ToggleAdminRole,
  GetAllAdmins,
  UpdatePassword,
  GetAllBookings,
  GetBookingById,
  DeleterCategoryById,
  PartiallyDeleteItinerary,
  UpdateNavCategories,
  UpdateCancellationPolicy,
  GetAllItinNames,
  DeleteBanner,
  EditCategoryOrderByIndexUpdate,
  GetAllEnquiries,
  CreateHeroSlide,
  UpdateHeroSlide,
  DeleteHeroSlide,
  ListHeroSlidesAdmin,
  CreateLocation,
  UpdateLocation,
  DeleteLocation,
  ListLocations,
  SetLocationItineraries,
  UpdateLocationOrder,
  GetAllCustomizeEnquiries,
  GetAllInstalinkEnquiries,
  UpdateLeadRemark,
  RegenerateCategoryRoutes,
};
