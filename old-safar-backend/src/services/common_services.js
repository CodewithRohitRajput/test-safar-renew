const { CommonHelper } = require("../../utils/common.helper");
const Constant = require("../../configs/constant");
const { PrismaClient } = require("@prisma/client");
const { date } = require("zod");
const { create } = require("payu-websdk/wrapper/invoice");

const prisma = new PrismaClient({});
prisma.$use(async (params, next) => {
  if (params.model == "Itinerary") {
    if (params.action === "findUnique" || params.action === "findFirst") {
      // Change to findFirst - you cannot filter
      // by anything except ID / unique with findUnique()
      params.action = "findFirst";
      // Add 'deleted' filter
      // ID filter maintained
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

const GetAllCategories = async ({ cursor, limit, isAdmin }) => {
  try {
    isAdmin = JSON.parse(isAdmin || false);
      let categories = isAdmin
      ? await prisma.categories.findMany({
          orderBy: {
            index: "asc",
          },
          include: {
            keyPoints: true,
            itinerary: {
              where: {
                itinerary: {
                  deleted: false,
                },
              },
              orderBy: { sequence: "asc" }, 
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
        })
      : await prisma.categories.findMany({
          orderBy: {
            index: "asc",
          },
          include: {
            keyPoints: true,
            itinerary: {
              where: {
                itinerary: {
                  is_active: true,
                  deleted: false,
                },
              },
              orderBy: { sequence: "asc" }, 
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

    // Process categories safely
    categories = categories.map((category) => {
      const iti = category.itinerary.map((itineraryItem) => {
        // Safe handling of base_packages
        const basePackages = itineraryItem.itinerary?.base_packages || [];
        const minPrice =
          basePackages.length > 0
            ? basePackages.reduce((min, packageItem) => {
                const price = packageItem?.discounted_price || 0;
                return price < min ? price : min;
              }, Infinity)
            : Infinity;

        return {
          ...itineraryItem.itinerary,
          startingPrice: minPrice === Infinity ? null : minPrice,
        };
      });
      return {
        ...category,
        itinerary: iti,
      };
    });

    return {
      categories,
    };
  } catch (error) {
    console.error("Error in GetAllCategories:", error);
    throw error;
  }
};

const GetCategoryById = async ({ id }, { isAdmin }) => {
  isAdmin = JSON.parse(isAdmin || false);
  // Fetch category data along with its related itineraries and keyPoints
  const category = isAdmin
    ? await prisma.categories.findFirst({
        where: {
          id: id,
        },
        include: {
          keyPoints: true,
          itinerary: {
            where: {
              itinerary: {
                deleted: false,
              },
            },
            orderBy: { sequence: "asc" },
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
      })
    : await prisma.categories.findFirst({
        where: {
          id: id,
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
            orderBy: { sequence: "asc" }, 
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
    return;
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

const GetAllItineraries = async ({ cursor, limit, isAdmin }) => {
  isAdmin = JSON.parse(isAdmin || false);
  limit = Number(limit) || 10;
  const totalCount = isAdmin
    ? await prisma.itinerary.count({
        where: {
          deleted: false,
        },
      })
    : await prisma.itinerary.count({
        where: {
          deleted: false,
          // is_active: true,
        },
      });

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit);

  const itineraries = isAdmin
    ? await prisma.itinerary.findMany({
        where: {
          deleted: false,
        },
        take: limit + 1, // Fetch one more record to check if there's a next page
        skip: 0, // Skip the cursor if it exists
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          {
            title: "asc",
          },
        ],

        select: {
          id: true,
          title: true,
          shortDescription: true,
          city: true,
          view_images: true,
          itin_pdf: true,
          duration: true,
          is_active: true,
          is_trending: isAdmin,
          route_map: true,
          base_packages: {
            select: {
              discounted_price: true,
            },
            orderBy: {
              discounted_price: "asc",
            },
            take: 1,
          },
        },
      })
    : await prisma.itinerary.findMany({
        take: limit + 1, // Fetch one more record to check if there's a next page
        skip: 0, // Skip the cursor if it exists
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          {
            title: "asc",
          },
        ],
        where: {
          // is_active: true,
          deleted: false,
        },

        select: {
          id: true,
          title: true,
          shortDescription: true,
          city: true,
          view_images: true,
          itin_pdf: true,
          duration: true,
          is_active: true,
          route_map: true,
          base_packages: {
            select: {
              discounted_price: true,
            },
            orderBy: {
              discounted_price: "asc",
            },
            take: 1,
          },
        },
      });
  let nextCursor = null;
  if (itineraries.length > limit) {
    const nextItinerary = itineraries.pop(); // Remove the extra record
    nextCursor = nextItinerary.id; // Set the next cursor
  }
  const isFirstPage = !cursor;
  let previousCursor = null;
  if (cursor) {
    const previousItineraries = isAdmin
      ? await prisma.itinerary.findMany({
          where: {
            deleted: false,
          },
          take: limit, // Fetch the previous set of items
          cursor: { id: cursor }, // Start from the current cursor
          skip: 1, // Skip the current cursor
          orderBy: [
            {
              title: "desc", // Reverse order to get previous items
            },
          ],
          select: {
            id: true,
          },
        })
      : await prisma.itinerary.findMany({
          where: {
            deleted: false,
            // is_active: true,
          },
          take: limit, // Fetch the previous set of items
          cursor: { id: cursor }, // Start from the current cursor
          skip: 1, // Skip the current cursor
          orderBy: [
            {
              title: "desc", // Reverse order to get previous items
            },
          ],
          select: {
            id: true,
          },
        });
    if (previousItineraries.length > 0) {
      previousCursor = previousItineraries[previousItineraries.length - 1].id; // Set the previous cursor
    }
  }

  // Determine if it's the last page
  const isLastPage = !nextCursor;
  const currentPage = cursor
    ? Math.ceil(
        (await prisma.itinerary.count({
          where: {
            deleted: false,
            id: {
              lt: cursor, // Count the records before the current cursor
            },
          },
        })) / limit
      ) + 1
    : 1;
  const itinerariesWithLowestPrice = itineraries.map((itinerary) => ({
    ...itinerary,
    startin_price:
      itinerary.base_packages.length > 0
        ? itinerary.base_packages[0].discounted_price
        : null,
  }));
  return {
    itineraries: itinerariesWithLowestPrice,
    previousCursor,
    nextCursor,
    totalCount,
    totalPages,
    currentPage,
    isFirstPage,
    isLastPage,
  };
};

const GetItineraryById = async ({ id }) => {
  console.log(id);
  const itinerary = await prisma.itinerary.findUnique({
    where: {
      id: id,
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
      //      category: {
      //        select: {
      //          category: {
      //            select: {
      //              id: true,
      //              name: true,
      //            },
      //          },
      //        },
      //      },
      base_packages: true,
      pickup_point: true,
      drop_point: true,
      batches: {
        orderBy: {
          start_date: "asc",
        },
      },
      inclusions_exclusions: true,
      locations: {
        include: {
          location: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  const cancellation_policies = await prisma.cancellationPolicy.findFirst({
    select: {
      policies: true,
    },
  });
  itinerary.cancellation_policy = cancellation_policies;
  return itinerary;
};

//{ADD BY YUVRAJ}
const SearchItinerariesByNameAndCity = async (query) => {
  const keyword = query.title?.trim().toLowerCase() || "";

  const result = await prisma.itinerary.findMany({
    where: {
      deleted: false,
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { city: { contains: keyword, mode: "insensitive" } },
      ],
    },
    include: {
      base_packages: {
        select: {
          discounted_price: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const itinerariesWithPrice = result.map((itinerary) => {
    const minPrice = itinerary.base_packages?.length
      ? Math.min(
          ...itinerary.base_packages.map((pkg) => pkg.discounted_price ?? 0)
        )
      : null;

    return {
      id: itinerary.id,
      title: itinerary.title,
      city: itinerary.city,
      view_images: itinerary.view_images,
      is_active: itinerary.is_active,
      is_trending: itinerary.is_trending,
      duration: itinerary.duration,
      itin_pdf: itinerary.itin_pdf,
      startin_price: minPrice,
    };
  });

  return itinerariesWithPrice;
};

//{ADD BY YUVRAJ}
const GetItinerarySuggestions = async (query) => {
  const { query: searchTerm } = query;

  const result = await prisma.itinerary.findMany({
    where: {
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { city: { contains: searchTerm, mode: "insensitive" } },
      ],
      deleted: false,
    },
    select: {
      id: true,
      title: true,
      city: true,
    },
    take: 8,
  });

  return result;
};

const SearchItineraries = async ({
  search,
  trip_type,
  duration,
  month,
  min_budget,
  max_budget,
}) => {
  const durationConditions = {
    "0:1": { gte: 0, lte: 1 },
    "2:5": { gte: 2, lt: 5 },
    "5:7": { gte: 5, lt: 7 },
    7: { gte: 7 },
  };

  const monthMapping = {
    jan: 1,
    feb: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    sept: 9,
    oct: 10,
    nov: 11,
    dec: 12,
  };
  let startDate, endDate;
  if (month) {
    const year = new Date().getFullYear(); // Current year
    const monthNum = monthMapping[month.toLowerCase()];
    startDate = new Date(year, monthNum - 1, 1);
    endDate = new Date(year, monthNum, 0); // Last day of the month
  }

  const itineraries = await prisma.itinerary.findMany({
    where: {
      is_active: true,
      deleted: false,
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { shortDescription: { contains: search, mode: "insensitive" } },
                { city: { contains: search, mode: "insensitive" } },
                { scenery: { contains: search, mode: "insensitive" } },
                { cultural_sites: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        trip_type
          ? {
              category: {
                some: {
                  category: {
                    name: { contains: trip_type, mode: "insensitive" },
                  },
                },
              },
            }
          : {},
        duration ? { duration: durationConditions[duration] } : {},
        month
          ? {
              batches: {
                some: { start_date: { gte: startDate, lte: endDate } },
              },
            }
          : {},
        min_budget
          ? {
              base_packages: {
                some: { discounted_price: { gte: Number(min_budget) } },
              },
            }
          : {},
        max_budget
          ? {
              base_packages: {
                some: { discounted_price: { lte: Number(max_budget) } },
              },
            }
          : {},
      ],
    },
    include: {
      category: true,
      base_packages: true,
      batches: true,
    },
  });
  const itinerariesWithLowestPrice = itineraries.map((itinerary) => ({
    ...itinerary,
    starting_price:
      itinerary.base_packages.length > 0
        ? itinerary.base_packages[0].discounted_price
        : null,
  }));

  return itinerariesWithLowestPrice;
};

const GetHomeCategories = async () => {
  const categories = await prisma.categories.findMany({
    orderBy: {
      index: "asc",
    },
  });
  return categories;
};
const GetHomeItin = async () => {
  const itin = await prisma.itinerary.findMany({
    where: {
      is_hero: true,
      is_active: true,
      deleted: false,
    },
  });
  return itin;
};

{
  /*Comented by Yuvraj*/
}
// const GetNavCatgeories = async ({ isAdmin }) => {
//   isAdmin = JSON.parse(isAdmin || false);
//   let categories = isAdmin
//     ? await prisma.categories.findMany({
//         orderBy: {
//           index: "asc",
//         },
//         //where: {
//           //is_nav: true,
//         //},
//       })
//     : await prisma.categories.findMany({
//         orderBy: {
//           index: "asc",
//         },
//         //where: {
//           //is_nav: true,
//         //},
//         include: {
//           itinerary: {
//             where: {
//               itinerary: {
//                 is_active: true,
//                 deleted: false,
//               },
//             },
//             take: 3,
//             select: {
//               itinerary: {
//                 select: {
//                   id: true,
//                   title: true,
//                   shortDescription: true,
//                   view_images: true,
//                   route_map: true,
//                 },
//               },
//             },
//           },
//         },
//       });
//   //resturcture itinerary
//   categories = categories.map((category) => {
//     const iti = category.itinerary.map((itineraryItem) => {
//       return {
//         ...itineraryItem.itinerary,
//       };
//     });
//     return {
//       ...category,
//       itinerary: iti,
//     };
//   });
//   return categories;
// };

const GetNavCatgeories = async ({ isAdmin }) => {
  isAdmin = JSON.parse(isAdmin || false);
  let categories = isAdmin
    ? await prisma.categories.findMany({
        orderBy: {
          index: "asc",
        },
        include: {
          keyPoints: true,
          itinerary: {
            where: {
              itinerary: {
                deleted: false,
              },
            },
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
      })
    : await prisma.categories.findMany({
        orderBy: {
          index: "asc",
        },
        include: {
          keyPoints: true,
          itinerary: {
            where: {
              itinerary: {
                is_active: true,
                deleted: false,
              },
            },
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

  // Process categories similar to GetAllCategories
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
        startingPrice: minPrice === Infinity ? null : minPrice,
      };
    });
    return {
      ...category,
      itinerary: iti,
    };
  });

  return categories;
};

const GetCanellationPolicies = async () => {
  const policy = await prisma.cancellationPolicy.findFirst({
    select: {
      policies: true,
    },
  });
  return policy;
};

const submitCallbackRequest = async (data) => {
  try {
    const newRequest = await prisma.callbackRequest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        destination: data.destination,
        travelDate: new Date(data.travelDate),
        travelers: parseInt(data.travelers),
        //itinerary_id: data.itinerary_id || null,
        itinerary_title: data.itinerary_title || null,
        itinerary_image: data.itinerary_image || null,
        itinerary_id: data.itinerary_id || null,
        enquiry_type: data.enquiry_type || "customize",
        callback_request: data.callback_request || false,
        remark: data.remark || null,
        createdAt: new Date(),
      },
    });
    return newRequest;
  } catch (error) {
    throw new Error(
      "Failed to submit custom callback request: " + error.message
    );
  }
};

module.exports = {
  GetAllCategories,
  GetCategoryById,
  GetAllItineraries,
  GetItineraryById,
  SearchItineraries,
  GetHomeCategories,
  GetHomeItin,
  GetNavCatgeories,
  GetCanellationPolicies,
  SearchItinerariesByNameAndCity,
  GetItinerarySuggestions,
  submitCallbackRequest,
};
