const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({});

const AddReview = async ({
  text,
  reviewer_name,
  reviewer_image,
  rating,
  isLandingPage,
  itineraryId
}) => {
  const review = await prisma.review.create({
    data: {
      text,
      reviewer_name,
      reviewer_image,
      rating,
      isLandingPage: isLandingPage || false,
      ...(itineraryId && {
        itinerary: {
          connect: { id: itineraryId }
        }
      })
    }
  });

  return review;
};

const UpdateReview = async (id, updateData) => {
  // Validate the incoming data
  const validFields = [
    'text',
    'reviewer_name',
    'reviewer_image',
    'rating',
    'isLandingPage',
    'itineraryId'
  ];
  
  // Only include valid fields that are present in updateData
  const sanitizedData = Object.keys(updateData)
    .filter(key => validFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = updateData[key];
      return obj;
    }, {});

  // Handle itineraryId separately if present
  if (sanitizedData.itineraryId) {
    sanitizedData.itinerary = {
      connect: { id: sanitizedData.itineraryId }
    };
    delete sanitizedData.itineraryId;
  }

  const review = await prisma.review.update({
    where: { id },
    data: sanitizedData
  });

  return review;
};

const DeleteReview = async (id) => {
  await prisma.review.delete({
    where: { id }
  });
  
  return { success: true };
};

const GetReviews = async ({ isLandingPage, itineraryId, page = 1, limit = 10 }) => {
  const validPage = Math.max(1, page);
  const validLimit = Math.max(1, Math.min(limit, 100));
  const skip = (validPage - 1) * validLimit;
  
  let where = {};
  
  if (isLandingPage !== undefined) {
    where.isLandingPage = isLandingPage;
  }
  
  if (itineraryId) {
    where.itineraryId = itineraryId;
  }

  console.log('Final where clause:', where);

  const [reviews, total] = await prisma.$transaction([
    prisma.review.findMany({
      where,
      skip,
      take: validLimit,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        itinerary: {
          select: {
            title: true,
            city: true,
            view_images: true,
            route_map: true
          }
        }
      }
    }),
    prisma.review.count({ where })
  ]);

  return {
    reviews,
    pagination: {
      total,
      page: validPage,
      pages: Math.ceil(total / validLimit)
    }
  };
};

const AssignReviewToItinerary = async (itineraryId, reviewId) => {
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: {
      itinerary: {
        connect: { id: itineraryId }
      }
    },
    include: {
      itinerary: {
        select: {
          title: true,
          city: true,
          view_images: true
        }
      }
    }
  });

  return review;
};

const RemoveReviewFromItinerary = async (reviewId) => {
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: {
      itinerary: {
        disconnect: true
      }
    }
  });

  return review;
};

module.exports = {
  AddReview,
  UpdateReview,
  DeleteReview,
  GetReviews,
  AssignReviewToItinerary,
  RemoveReviewFromItinerary
};
