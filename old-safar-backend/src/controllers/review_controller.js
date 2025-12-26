const { CommonHelper } = require("../../utils/common.helper");
const Constant = require("../../configs/constant");
const ReviewServices = require("../services/review_services");

const AddReview = async (req, res) => {
  try {
    const data = await ReviewServices.AddReview(req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "REVIEW_ADDED",
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

const UpdateReview = async (req, res) => {
  try {
    const data = await ReviewServices.UpdateReview(req.params.id, req.body);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "REVIEW_UPDATED",
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

const DeleteReview = async (req, res) => {
  try {
    const data = await ReviewServices.DeleteReview(req.params.id);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "REVIEW_DELETED",
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

const GetReviews = async (req, res) => {
  try {
    const { isLandingPage, itineraryId, page = 1, limit = 10 } = req.query;
    
    // Parse isLandingPage more carefully
    let parsedIsLandingPage;
    if (isLandingPage === 'true') {
      parsedIsLandingPage = true;
    } else if (isLandingPage === 'false') {
      parsedIsLandingPage = false;
    } else {
      parsedIsLandingPage = undefined; // This will fetch all reviews if not specified
    }


    const data = await ReviewServices.GetReviews({
      isLandingPage: parsedIsLandingPage,
      itineraryId: itineraryId || req.params.itineraryId,
      page: Number(page) || 1,
      limit: Number(limit) || 10
    });

    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "REVIEWS_FETCHED",
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

const AssignReviewToItinerary = async (req, res) => {
  try {
    const { itineraryId } = req.params;
    const { reviewId } = req.body;
    const data = await ReviewServices.AssignReviewToItinerary(itineraryId, reviewId);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "REVIEW_ASSIGNED",
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

const RemoveReviewFromItinerary = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const data = await ReviewServices.RemoveReviewFromItinerary(reviewId);
    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "REVIEW_REMOVED",
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

module.exports = {
  AddReview,
  UpdateReview,
  DeleteReview,
  GetReviews,
  AssignReviewToItinerary,
  RemoveReviewFromItinerary
};
