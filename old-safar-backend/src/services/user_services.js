const { CommonHelper } = require("../../utils/common.helper");
const Constant = require("../../configs/constant");

const { PrismaClient } = require("@prisma/client");
const axios = require("axios");

const prisma = new PrismaClient({});
prisma.$use(async (params, next) => {
  if (params.model == "Itinerary") {
    if (params.action === "findUnique" || params.action === "findFirst") {
      params.action = "findFirst";
      params.args.where["deleted"] = false;
    }
    if (
      params.action === "findFirstOrThrow" ||
      params.action === "findUniqueOrThrow"
    ) {
      if (params.args.where) {
        if (params.args.where.deleted == undefined) {
          // Exclude deleted records if they have not been explicitly requested
          params.args.where["deleted"] = false;
        }
      } else {
        params.args["where"] = { deleted: false };
      }
    }
    if (params.action === "findMany") {
      // Find many queries
      if (params.args.where) {
        if (params.args.where.deleted == undefined) {
          params.args.where["deleted"] = false;
        }
      } else {
        params.args["where"] = { deleted: false };
      }
    }
  }
  return next(params);
});

prisma.$use(async (params, next) => {
  if (params.model == "Itinerary") {
    if (params.action == "update") {
      // Change to updateMany - you cannot filter
      // by anything except ID / unique with findUnique()
      params.action = "updateMany";
      // Add 'deleted' filter
      // ID filter maintained
      params.args.where["deleted"] = false;
    }
    if (params.action == "updateMany") {
      if (params.args.where != undefined) {
        params.args.where["deleted"] = false;
      } else {
        params.args["where"] = { deleted: false };
      }
    }
  }
  return next(params);
});

prisma.$use(async (params, next) => {
  // Check incoming query type
  if (params.model == "Itinerary") {
    if (params.action == "delete") {
      // Delete queries
      // Change action to an update
      params.action = "update";
      params.args["data"] = { deleted: true };
    }
    if (params.action == "deleteMany") {
      // Delete many queries
      params.action = "updateMany";
      if (params.args.data != undefined) {
        params.args.data["deleted"] = true;
      } else {
        params.args["data"] = { deleted: true };
      }
    }
  }
  return next(params);
});

let bannersId = "";

const AddCustomizeRequest = async ({
  name,
  email,
  phone,
  destination,
  start_date,
  preferred_hotel,
  people_count,
  night_stay_count,
  travel_mode,
  activities,
  source,
  requirements,
  itinerary_id,
}) => {
  const currentYear = `${new Date().getFullYear()}`;
  const currentMonth = Constant.MONTH[new Date().getMonth()];

  // Step 1: Find or create dashboard data for the current year
  let dashboardData = await prisma.dashboardData.findFirst({
    where: { current_year: currentYear },
    select: {
      id: true,
      monthly_data: { where: { month: currentMonth } },
    },
  });

  // If no dashboard data exists, create it without monthly data
  if (!dashboardData) {
    dashboardData = await prisma.dashboardData.create({
      data: {
        current_year: currentYear,
        total_requests: 0,
        total_bookings: 0,
        total_revenue: 0,
      },
    });
  }

  // Step 2: Find or create monthly data for the current month
  let monthlyDataId;

  if (dashboardData.monthly_data.length > 0) {
    // Monthly data exists, use its ID
    monthlyDataId = dashboardData.monthly_data[0].id;

    await prisma.monthlyData.update({
      where: { id: monthlyDataId },
      data: { requests: { increment: 1 } },
    });
  } else {
    // No monthly data for the current month, create it
    const newMonthlyData = await prisma.monthlyData.create({
      data: {
        month: currentMonth,
        requests: 1,
        bookings: 0,
        revenue: 0,
        dashboardId: dashboardData.id,
      },
    });

    monthlyDataId = newMonthlyData.id;
  }

  // Step 3: Create request and update dashboard data within a transaction
  const [request] = await prisma.$transaction([
    prisma.requests.create({
      data: {
        name,
        email,
        phone,
        destination,
        start_date,
        source,
        preferred_hotel,
        people_count,
        night_stay_count,
        travel_mode,
        activities,
        requirements,
      },
    }),
    prisma.dashboardData.update({
      where: { id: dashboardData.id },
      data: { total_requests: { increment: 1 } },
    }),
  ]);

  // Step 4: Create callback request with itinerary_id
  if (itinerary_id) {
    await prisma.callbackRequest.create({
      data: {
        name,
        email,
        phone,
        destination,
        travelDate: start_date,
        travelers: people_count,
        itinerary_id: itinerary_id,        
      },
    });
  }

  return request;
};

const UpdateClickCount = async ({ id }) => {
  console.log(id + "hello");
  const count = await prisma.banners.count();
  console.log(count);
  if (count == 0) {
    await prisma.banners.create({
      data: {
        total_clicks: 0,
      },
    });
  }
  if (bannersId == "") {
    console.log("fetched");
    bannersId = await prisma.banners.findFirst({
      orderBy: {
        id: "desc",
      },
    });
  }
  const request = await prisma.$transaction([
    prisma.banner.update({
      where: {
        id: id,
      },
      data: {
        click_count: {
          increment: 1,
        },
      },
    }),

    prisma.banners.update({
      where: {
        id: bannersId.id,
      },
      data: {
        total_clicks: {
          increment: 1,
        },
      },
    }),
  ]);
  return request;
};

const GetHomeCategories = async ({ isAdmin }) => {
  let categories = await prisma.categories.findMany({
    where: {
      is_home: true,
    },
    orderBy: {
      index: "asc",
    },
    include: {
      itinerary: {
        where: {
          itinerary: {
            is_active: true,
            deleted: false,
          },
        },
        take: 4,
        select: {
          itinerary: {
            include: {
              base_packages: {
                select: {
                  discounted_price: true,
                },
              },
            },
          },
        },
      },
    },
  });
  categories = categories.map((category) => {
    const iti = category.itinerary.map((itineraryItem) => {
      const minPrice = itineraryItem.itinerary.base_packages.reduce(
        (min, packageItem) => {
          return packageItem.discounted_price < min
            ? packageItem.discounted_price
            : min;
        },
        Infinity
      );

      return {
        ...itineraryItem.itinerary,
        startingPrice: minPrice === Infinity ? null : minPrice, // Set to null if no packages available
      };
    });
    return {
      ...category,
      itinerary: iti,
    };
  });
  return categories;
};
const GetHomeBanners = async () => {
  const banners = await prisma.banner.findMany({
    where: {
      is_active: true,
    },
    select: {
      id: true,
      image: true,
      title: true,
      category_id: true,
      category_name: true,
      route_map: true,
    },
  });
  return banners;
};
const GetTrendingItineraries = async () => {
  let itineraries = await prisma.itinerary.findMany({
    where: {
      is_trending: true,
      deleted: false,
      is_active: true,
    },
    include: {
      base_packages: {
        select: {
          discounted_price: true,
        },
      },
    },
  });
  itineraries = itineraries.map((itinerary) => {
    const minPrice = itinerary.base_packages.reduce((min, packageItem) => {
      return packageItem.discounted_price < min
        ? packageItem.discounted_price
        : min;
    }, Infinity);
    return {
      ...itinerary,
      startingPrice: minPrice === Infinity ? null : minPrice,
    };
  });

  return itineraries;
};

const GetOfferHeadline = async () => {
  const offer = await prisma.contents.findFirst({
    select: {
      offer_headline: {
        select: {
          title: true,
          is_active: true,
        },
      },
    },
  });
  if(!offer || !offer.offer_headline) return false;
  return offer.offer_headline.is_active ? offer.offer_headline.title : false;
};

const GetTermsConditions = async () => {
  const terms = await prisma.contents.findFirst({
    select: {
      terms_and_conditions: true,
    },
  });
  if(!terms || !terms.terms_and_conditions) return null;
  return terms.terms_and_conditions;
};

const GetGalleryImages = async ({ is_main }) => {
  console.log(is_main);
  is_main = JSON.parse(is_main || false);
  console.log(is_main);
  const limit = is_main ? 5 : undefined;
  const images = await prisma.contents.findFirst({
    select: {
      gallery: {
        take: limit,
        select: {
          images: true,
          is_center: true,
        },
      },
    },
  });
  return images;
};

const AddCallBackRequest = async ({ name, email, phone, description }) => {
  try {
    let dashboardData = await prisma.dashboardData.findFirst({
      where: {
        current_year: `${new Date().getFullYear()}`,
      },
      select: {
        id: true,
        monthly_data: {
          where: {
            month: Constant.MONTH[new Date().getMonth()],
          },
        },
      },
    });

    console.log(dashboardData);
    
    if (!dashboardData) {
      dashboardData = await prisma.dashboardData.create({
        data: {
          current_year: `${new Date().getFullYear()}`,
          total_requests: 0,
          total_bookings: 0,
          total_revenue: 0,
          monthly_data: {
            create: {
              month: Constant.MONTH[new Date().getMonth()],
              requests: 0,
              bookings: 0,
              revenue: 0,
            },
          },
        },
      });
    }

    // Check if monthly_data exists and has at least one item
    const monthlyDataExists = dashboardData.monthly_data && dashboardData.monthly_data.length > 0;
    
    const [request] = await prisma.$transaction([
      prisma.callbackRequest.create({
        data: {
          name,
          email,
          phone,
          destination: "Not specified", // Add required field
          travelDate: new Date(), // Add required field
          travelers: 1, // Add required field
          remark: description, // Use description as remark since it's optional
          enquiry_type: "callback", // Set enquiry type
          callback_request: true, // Set callback request to true
        },
      }),
      prisma.dashboardData.update({
        where: {
          id: dashboardData.id,
        },
        data: {
          total_requests: {
            increment: 1,
          },
          monthly_data: monthlyDataExists ? {
            upsert: {
              where: {
                id: dashboardData.monthly_data[0].id,
              },
              update: {
                requests: {
                  increment: 1,
                },
              },
              create: {
                month: Constant.MONTH[new Date().getMonth()],
                requests: 1,
                bookings: 0,
                revenue: 0,
              },
            },
          } : {
            create: {
              month: Constant.MONTH[new Date().getMonth()],
              requests: 1,
              bookings: 0,
              revenue: 0,
            },
          },
        },
      }),
    ]);
    
    return request;
  } catch (error) {
    console.error("Error in AddCallBackRequest:", error);
    throw error;
  }
};

//https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJzdy64F7jYjkRvdyYHSzrhck&fields=reviews
const FetchGoogleReviews = async () => {
  const placeId = "ChIJzdy64F7jYjkRvdyYHSzrhck";
  const fields = "reviews";
  const key = process.env.GOOGLE_PLACES_API;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${key}`;
  const response = await axios.get(url).then((response) => {
    if (response.data.status == "OK") {
      return response.data;
    }
  });
  return response.result;
};

const GetItineraryByRoute = async ({ route }) => {
  const itinerary = await prisma.itinerary.findUnique({
    where: {
      route_map: route,
      deleted: false,
    },
    include: {
      day_details: {
        orderBy: {
          day: "asc",
        },
        include: {
          activiteis: true,
        },
      },
      hotels: true,
      category: true,
      // category: {
      //   select: {
      //     category: {
      //       select: {
      //         name: true,
      //         id: true,
      //       },
      //     },
      //   },
      // },
      base_packages: true,
      pickup_point: true,
      drop_point: true,
      batches: {
        where: {
          start_date: {
            gte: new Date(),
          },
        },
        orderBy: {
          start_date: "asc",
        },
      },
      inclusions_exclusions: true,
    },
  });
  // not necessary
  const cancellation_policies = await prisma.cancellationPolicy.findFirst({
    select: {
      policies: true,
    },
  });
  itinerary.cancellation_policy = cancellation_policies;
  return itinerary;
};

const GetCategoryByRoute = async ({ route }) => {
  // Fetch category data along with its related itineraries and keyPoints
  const category = await prisma.categories.findFirst({
    where: {
      route_map: route,
    },
    include: {
      keyPoints: true,
      itinerary: {
        where: {
          itinerary: {
            deleted: false,
            is_active: true,
          },
        },
        include: {
          itinerary: {
            include: {
              base_packages: {
                select: {
                  discounted_price: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!category) {
    throw new Error("Category not found");
  }
  // Now calculate the minimum discounted price for each itinerary
  const itinerariesWithStartingPrice = category.itinerary.map(
    (itineraryItem) => {
      const minPrice = itineraryItem.itinerary.base_packages.reduce(
        (min, packageItem) => {
          return packageItem.discounted_price < min
            ? packageItem.discounted_price
            : min;
        },
        Infinity
      );

      return {
        ...itineraryItem.itinerary,
        startingPrice: minPrice === Infinity ? null : minPrice, // Set to null if no packages available
      };
    }
  );

  // Return the category along with modified itineraries containing the starting price
  return {
    ...category,
    itinerary: itinerariesWithStartingPrice,
  };
};

//ADDED FOR INSTALINK
const GetInstaLinkData = async ({ category, city, limit = 20, offset = 0 }) => {
  try {
    // Build where clause for itineraries
    const whereClause = {
      deleted: false,
      is_active: true,
    };

    // Add category filter if provided
    if (category && category !== "all") {
      whereClause.category = {
        some: {
          category: {
            id: category,
          },
        },
      };
    }

    // Add location filter if provided - filter by location relationship
    if (city && city !== "all") {
      whereClause.locations = {
        some: {
          location: {
            id: city,
          },
        },
      };
    }

    // Fetch ALL categories (not just nav categories)
    const categories = await prisma.categories.findMany({
      where: {
        // Remove is_nav filter to get all categories
      },
      select: {
        id: true,
        name: true,
        route_map: true,
      },
      orderBy: {
        index: "asc",
      },
    });

    // Add "All" category at the beginning
    const allCategories = [
      { id: "all", name: "All", slug: "all" },
      ...categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.route_map || cat.name.toLowerCase().replace(/\s+/g, "-"),
      })),
    ];

    // Fetch locations from admin/location table
    const adminLocations = await prisma.location.findMany({
      where: {
        // You can add filters here if needed
      },
      select: {
        id: true,
        name: true,
        image: true,
        route_map: true,
      },
      orderBy: {
        index: "asc",
      },
    });

    const locations = adminLocations.map((location) => ({
      id: location.id,
      name: location.name,
      slug:
        location.route_map || location.name.toLowerCase().replace(/\s+/g, "-"),
      image: location.image || "/assets/svgs/images/default-location.jpg",
    }));

    const allLocations = [
      {
        id: "all",
        name: "All",
        slug: "all",
        image: "/assets/svgs/images/all-locations.jpg",
      },
      ...locations,
    ];

    // Fetch itineraries with pagination
const [itineraries, total] = await Promise.all([
  prisma.itinerary.findMany({
    where: whereClause,
    select: {
      id: true,
      title: true,
      city: true,
      route_map: true, 
      view_images: true,
      itin_pdf: true,
      category: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      locations: {
        select: {
          location: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      batches: {
        where: {
          start_date: {
            gte: new Date(),
          },
        },
        orderBy: {
          start_date: "asc",
        },
        take: 3, // Limit to 3 upcoming batches
        select: {
          start_date: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: parseInt(limit),
    skip: parseInt(offset),
  }),
  prisma.itinerary.count({
    where: whereClause,
  }),
]);

    // Format itineraries for response
    const formattedItineraries = itineraries.map((itinerary) => {
      // Format batches to show only dates
      const formattedBatches = itinerary.batches.map((batch) => {
        const date = new Date(batch.start_date);
        return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      });

      // Get the first category
      const firstCategory = itinerary.category[0]?.category;

      // Get the first location
      const firstLocation = itinerary.locations[0]?.location;

      return {
        id: itinerary.id,
        title: itinerary.title,
        city: itinerary.city,
        route_map: itinerary.route_map,
        categoryId: firstCategory?.id || null,
        categoryName: firstCategory?.name || null,
        locationId: firstLocation?.id || null,
        locationName: firstLocation?.name || null,
        thumbnail:
          itinerary.view_images[0] ||
          "/assets/svgs/images/default-itinerary.png",
        itin_pdf: itinerary.itin_pdf || null,
        batches: formattedBatches,
        website: `${process.env.FRONTEND_URL || "https://safarwanderlust.com"}/itinerary/${itinerary.route_map}`,
      };
    });

    return {
      categories: allCategories,
      locations: allLocations,
      itineraries: formattedItineraries,
      total,
    };
  } catch (error) {
    console.error("Error in GetInstaLinkData:", error);
    throw error;
  }
};

const AddInstalinkEnquiry = async ({ name, email, phone, destination, travelDate, travelers, itinerary_title, itinerary_image, itinerary_id, batch_id, enquiry_type, callback_request, remark }) => {
  try {
    const enquiry = await prisma.callbackRequest.create({
      data: {
        name,
        email,
        phone,
        destination,
        travelDate: new Date(travelDate),
        travelers: parseInt(travelers) || 1,
        itinerary_title,
        itinerary_image,
        itinerary_id,
        enquiry_type: enquiry_type || "instalink",
        callback_request: callback_request || false,
        remark,
      },
    });
    return enquiry;
  } catch (error) {
    console.error("Error creating Instalink enquiry:", error);
    throw error;
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
  FetchGoogleReviews,
  GetItineraryByRoute,
  GetCategoryByRoute,
  GetInstaLinkData,
  AddInstalinkEnquiry,
};
