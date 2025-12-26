const { CommonHelper } = require("../../utils/common.helper");
const Constant = require("../../configs/constant");
const AdminServices = require("../services/admin_services");

const CommonServices = require("../services/common_services");

const GetAllCategories = async (req, res) => {
  try {
    const response = await CommonServices.GetAllCategories(req.query);
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

const GetCategoryById = async (req, res) => {
  try {
    const category = await CommonServices.GetCategoryById(
      req.params,
      req.query
    );
    if (!category) {
      return CommonHelper.sendError(
        res,
        false,
        Constant.STATUS_CODE.HTTP_404_NOT_FOUND,
        "CATEGORY_NOT_FOUND"
      );
    }
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "CATEGORY_FOUND",
      category
    );
  } catch (error) {
    console.log(error);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      "SOMETHING_WENT_WRONG"
    );
  }
};
const GetAllItineraries = async (req, res) => {
  try {
    const response = await CommonServices.GetAllItineraries(req.query);
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

const GetItineraryById = async (req, res) => {
  try {
    const itinerary = await CommonServices.GetItineraryById(req.params);
    if (!itinerary) {
      return CommonHelper.sendError(
        res,
        false,
        Constant.STATUS_CODE.HTTP_404_NOT_FOUND,
        "ITINERARY_NOT_FOUND"
      );
    }
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "ITINERARY_FOUND",
      itinerary
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
//{ADD BY YUVRAJ}
const SearchItinerariesByNameAndCity = async (req, res) => {
  try {
    const response = await CommonServices.SearchItinerariesByNameAndCity(
      req.query
    );
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "ITINERARIES_SEARCHED",
      response
    );
  } catch (err) {
    console.log(err);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err.message
    );
  }
};
//{ADD BY YUVRAJ}
const GetItinerarySuggestions = async (req, res) => {
  try {
    const result = await CommonServices.GetItinerarySuggestions(req.query);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "SUGGESTIONS_FETCHED",
      result
    );
  } catch (err) {
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err.message
    );
  }
};

const SearchItineraries = async (req, res) => {
  try {
    const response = await CommonServices.SearchItineraries(req.query);
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
const GetHomeCategories = async (req, res) => {
  try {
    const response = await CommonServices.GetHomeCategories();
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
const GetHomeItin = async (req, res) => {
  try {
    const response = await CommonServices.GetHomeItin();
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
const GetNavCatgeories = async (req, res) => {
  try {
    const response = await CommonServices.GetNavCatgeories(req.query);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "NAV_CATEGORIES_FETCHED",
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

const GetCanellationPolicies = async (req, res) => {
  try {
    const response = await CommonServices.GetCanellationPolicies();
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "CANCELLATION_POLICIES_FETCHED",
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

const handleCustomCallbackRequest = async (req, res, next) => {
  try {
    const data = req.body;

    const response = await CommonServices.submitCallbackRequest(data);

    return res.status(200).json({
      success: true,
      message:
        "Your query has been submitted. Our team will contact you shortly.",
      data: response,
    });
  } catch (error) {
    console.error("Custom Callback Request Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const GetHeroSlides = async (req, res) => {
  try {
    const slides = await AdminServices.ListHeroSlides();
    return CommonHelper.sendSuccess(
      res,
      true,
      200,
      "HERO_SLIDES_FETCHED",
      slides
    );
  } catch (err) {
    return CommonHelper.sendError(res, false, 500, err.message);
  }
};
module.exports = {
  GetAllCategories,
  GetAllItineraries,
  GetCategoryById,
  GetItineraryById,
  SearchItineraries,
  GetHomeCategories,
  GetHomeItin,
  GetNavCatgeories,
  GetCanellationPolicies,
  SearchItinerariesByNameAndCity,
  GetItinerarySuggestions,
  handleCustomCallbackRequest,
  GetHeroSlides,
};
