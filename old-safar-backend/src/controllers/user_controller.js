const { CommonHelper } = require("../../utils/common.helper");
const Constant = require("../../configs/constant");
const UserServices = require("../services/user_services");
const { JWTHelper } = require("../../utils/jwt.token.helper");

const AddCustomizeRequest = async (req, res) => {
  try {
    const request = await UserServices.AddCustomizeRequest(req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "REQUEST_ADDED",
      request
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

const UpdateClickCount = async (req, res) => {
  try {
    const request = await UserServices.UpdateClickCount(req.query);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "CLICK_COUNT_UPDATED",
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
const GetHomeCategories = async (req, res) => {
  try {
    const response = await UserServices.GetHomeCategories(req.query);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "CATEGORIES_FETCHED",
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
const GetHomeBanners = async (req, res) => {
  try {
    const response = await UserServices.GetHomeBanners();
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "BANNERS_FETCHED",
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
const GetTrendingItineraries = async (req, res) => {
  try {
    const response = await UserServices.GetTrendingItineraries();
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "ITINERARIES_FETCHED",
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
const GetOfferHeadline = async (req, res) => {
  try {
    const response = await UserServices.GetOfferHeadline();
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "OFFER_FETCHED",
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

const GetTermsConditions = async (req, res) => {
  try {
    const response = await UserServices.GetTermsConditions();
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "TERMS_FETCHED",
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
const GetGalleryImages = async (req, res) => {
  try {
    const response = await UserServices.GetGalleryImages(req.query);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "GALLERY_IMAGES_FETCHED",
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

const AddCallBackRequest = async (req, res) => {
  try {
    const response = await UserServices.AddCallBackRequest(req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "REQUEST_ADDED",
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
const FetchGoogleReviews = async (req, res) => {
  try {
    const response = await UserServices.FetchGoogleReviews();
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "REVIEWS_FETCHED",
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
const GetItineraryByRoute = async (req, res) => {
  try {
    const response = await UserServices.GetItineraryByRoute(req.params);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "ITINERARY_FETCHED",
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
const GetCategoryByRoute = async (req, res) => {
  try {
    const response = await UserServices.GetCategoryByRoute(req.params);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "CATEGORY_FETCHED",
      response
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

//FOR instalink
const GetInstaLinkData = async (req, res) => {
  try {
    const response = await UserServices.GetInstaLinkData(req.query);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "INSTALINK_DATA_FETCHED",
      response
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
const AddInstalinkEnquiry = async (req, res) => {
  try {
    const response = await UserServices.AddInstalinkEnquiry(req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "ENQUIRY_ADDED",
      response
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

module.exports = {
  AddCustomizeRequest,
  UpdateClickCount,
  GetHomeCategories,
  GetHomeBanners,
  GetTrendingItineraries,
  GetOfferHeadline,
  GetTermsConditions,
  GetGalleryImages,
  AddCallBackRequest,
  GetItineraryByRoute,
  FetchGoogleReviews,
  GetCategoryByRoute,
  GetInstaLinkData,
  AddInstalinkEnquiry,
};
