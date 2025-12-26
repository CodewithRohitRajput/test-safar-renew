const { CommonHelper } = require("../../utils/common.helper");
const Constant = require("../../configs/constant");

const { PrismaClient } = require("@prisma/client");
var ObjectID = require("bson").BSON.ObjectId;

const prisma = new PrismaClient({});
const tempPrisma = new PrismaClient({});

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

// {Add by yuvraj}

const formatDescriptionAsList = (description) => {
  if (!description) return "";
  if (Array.isArray(description)) return description.join("\n");
  if (typeof description !== "string") return "";

  if (description.includes("<ul>") || description.includes("<li>") || description.includes("<ol>")) {
    return description;
  }
  const bulletPoints = description
    .split(/\r?\n/)
    .map((point) => point.trim())
    .filter((point) => point.length > 0);

  return bulletPoints
    .map((point) => point.replace(/^[-•]\s*/, "").trim())
    .join("\n");
};

const RegisterAdmin = async ({ name, email, password, phone, role }) => {
  const hashedPassword = await CommonHelper.hashingPassword(
    password,
    Constant.SALT_ROUNDS
  );
  const admin = await prisma.admin.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    },
  });
  return admin;
};

const UpdatePassword = async ({ id, new_password }) => {
  const hashedPassword = await CommonHelper.hashingPassword(
    new_password,
    Constant.SALT_ROUNDS
  );
  const admin = await prisma.admin.update({
    where: {
      id,
    },
    data: {
      password: hashedPassword,
    },
  });
  return admin;
};

const LoginAdmin = async ({ password, admin }) => {
  const isPasswordMatch = await CommonHelper.hashingComparePassword(
    password,
    admin.password
  );
  return isPasswordMatch;
};

// Replace the whole function with this
const AddNewCategory = async ({
  name,
  description,
  short_description,
  is_home,
  image,
  keyPoints,        
  banner_image,
  itineraries = [],
  seo_indexed,
  seo_title,
  seo_description,
  seo_keywords,
  seo_author,
}) => {
 
  const route_map = name.toLowerCase().trim().replace(/\s+/g, "-");

  // Check if a category with this route_map already exists
  const cat = await prisma.categories.findFirst({ where: { route_map } });
  if (cat) {
    throw new Error("Category with this name already exists");
  }

  const index = await prisma.categories.count();

  const category = await prisma.categories.create({
    data: {
      name,
      description,
      short_description,
      route_map,
      is_home,
      image,
      banner_image,
      index,
      seo_indexed: seo_indexed ?? true,
      seo_title: seo_title || null,
      seo_description: seo_description || null,
      seo_keywords: seo_keywords || null,
      seo_author: seo_author || "safarwanderlust",
      ...(Array.isArray(keyPoints) && keyPoints.length
        ? { keyPoints: { create: keyPoints } }
        : {}),
      itinerary: {
        create: (itineraries || []).map((itinerary, i) => ({
          itineraryId: typeof itinerary === "string" ? itinerary : itinerary.id,
          sequence:
            typeof itinerary === "object" && itinerary.sequence !== undefined
              ? itinerary.sequence
              : i,
        })),
      },
    },
    include: {
      keyPoints: true,
    },
  });

  return category;
};
const AddNewItinerary = async ({
  title,
  description,
  shortDescription,
  is_customize,
  city,
  view_images,
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
  locationIds = [],
  seo_indexed,
  seo_title,
  seo_description,
  seo_keywords,
  seo_author,
}) => {
  const route_map = title.split(" ").join("-").toLowerCase();
  const itin = await prisma.itinerary.findFirst({
    where: {
      route_map,
      deleted: false,
    },
  });
  if (itin) {
    throw new Error("Itinerary with this name already exists");
  }

  const itinerary = await prisma.itinerary.create({
    data: {
      title,
      description,
      shortDescription,
      is_customize,
      city,
      view_images,
      route_map,
      duration,
      altitude,
      scenery,
      cultural_sites,
      itin_pdf,
      seo_indexed: seo_indexed ?? true,
      seo_title: seo_title || null,
      seo_description: seo_description || null,
      seo_keywords: seo_keywords || null,
      seo_author: seo_author || "safarwanderlust",
      day_details: {
        create: day_details.map((day) => ({
          day: day.day,
          title: day.title,
          description: formatDescriptionAsList(day.description),
          places: day.places,
          activiteis: {
            create: day.activiteis?.map((activity) => ({
              description: activity.description,

              images: {
                set: activity.images, // Wrap the images array with `set`
              },
            })),
          },
        })),
      },
      hotels: {
        create: hotels.map((hotel) => ({
          name: hotel.name,
          rating: hotel.rating,
          images: hotel.images,
          reference: hotel.reference,
        })),
      },
      notes,
      base_packages: {
        create: base_packages.map((pkg) => ({
          name: pkg.name,
          original_price: pkg.original_price,
          discounted_price: pkg.discounted_price,
        })),
      },
      pickup_point: {
        create: pickup_point.map((pick) => ({
          name: pick.name,
          price: pick.price,
        })),
      },
      drop_point: {
        create: drop_point.map((drop) => ({
          name: drop.name,
          price: drop.price,
        })),
      },
      batches: {
        create: batches.map((batch) => ({
          start_date: batch.start_date,
          end_date: batch.end_date,
          is_sold: batch.is_sold,
        })),
      },
      is_trending,
      is_active,
      categoryId: categoryId,
      category: {
        create: categoryId.map((catId) => ({ categoryId: catId })),
      },
      inclusions_exclusions: {
        create: {
          inclusions: inclusions_exclusions.inclusions,
          exclusions: inclusions_exclusions.exclusions,
        },
      },
    },
    include: {
      day_details: {
        include: {
          activiteis: true,
        },
      },
      hotels: true,
      base_packages: true,
      pickup_point: true,
      drop_point: true,
      batches: true,
      category: true,
      inclusions_exclusions: true,
    },
  });

  if (locationIds.length) {
    await prisma.LocationsOnItineraries.createMany({
      data: locationIds.map((locationId) => ({
        locationId,
        itineraryId: itinerary.id,
      })),
    });
  }
  // Convert BigInt fields to Number before sending the response
  const sanitizedItinerary = {
    ...itinerary,
    base_packages: itinerary.base_packages.map((pkg) => ({
      ...pkg,
      original_price: Number(pkg.original_price),
      discounted_price: Number(pkg.discounted_price),
    })),
    pickup_point: itinerary.pickup_point.map((pick) => ({
      ...pick,
      price: Number(pick.price),
    })),
    drop_point: itinerary.drop_point.map((drop) => ({
      ...drop,
      price: Number(drop.price),
    })),
  };
  return sanitizedItinerary;
};

// Replace the whole function with this
const EditCategoryById = async (
  { id },
  {
    name,
    description,
    short_description,
    is_home,
    image,
    keyPoints,        // optional
    banner_image,
    itineraries = [],
    seo_indexed,
    seo_title,
    seo_description,
    seo_keywords,
    seo_author,
  }
) => {
  const dataToUpdate = {
    name,
    description,
    short_description,
    is_home,
    image,
    banner_image,
    ...(seo_indexed !== undefined && { seo_indexed: seo_indexed ?? true }),
    ...(seo_title !== undefined && { seo_title: seo_title || null }),
    ...(seo_description !== undefined && { seo_description: seo_description || null }),
    ...(seo_keywords !== undefined && { seo_keywords: seo_keywords || null }),
    ...(seo_author !== undefined && { seo_author: seo_author || "safarwanderlust" }),
    itinerary: {
      deleteMany: {}, // reset ordering
      create: (itineraries || []).map((itinerary, i) => ({
        itineraryId: typeof itinerary === "string" ? itinerary : itinerary.id,
        sequence:
          typeof itinerary === "object" && itinerary.sequence !== undefined
            ? itinerary.sequence
            : i,
      })),
    },
  };

  if (name) {
    dataToUpdate.route_map = name.split(" ").join("-").toLowerCase();
    
    
    const existingCategory = await prisma.categories.findFirst({
      where: {
        route_map: dataToUpdate.route_map,
        id: { not: id }, 
      },
    });
    
    if (existingCategory) {
      throw new Error("Category with this name already exists");
    }
  }

  if (Array.isArray(keyPoints)) {
    if (keyPoints.length === 0) {
      dataToUpdate.keyPoints = { deleteMany: {} };
    } else {
      dataToUpdate.keyPoints = {
        deleteMany: {
          id: {
            notIn: keyPoints
              .filter((kp) => kp.id !== undefined)
              .map((kp) => kp.id),
          },
        },
        upsert: keyPoints.map((kp) => ({
          where: { id: kp.id || "" },
          update: { title: kp.title, image: kp.image },
          create: { title: kp.title, image: kp.image },
        })),
      };
    }
  }

  const category = await prisma.categories.update({
    where: { id },
    data: dataToUpdate,
    include: {
      keyPoints: true,
      itinerary: { orderBy: { sequence: "asc" }, include: { itinerary: true } },
    },
  });
  return category;
};

const EditItineraryById = async (
  { id },
  {
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
    notes,
    is_trending,
    is_active,
    categoryId,
    day_details,
    hotels,
    base_packages,
    pickup_point,
    drop_point,
    batches,
    inclusions_exclusions,
    locationIds = [],
    seo_indexed,
    seo_title,
    seo_description,
    seo_keywords,
    seo_author,
  }
) => {
  try {
    // First, get the current sequence positions for this itinerary in all categories
    const currentCategoryRelations =
      await prisma.CategoriesOnItineraries.findMany({
        where: { itineraryId: id },
        select: { categoryId: true, sequence: true },
      });

    // Create a map of categoryId to sequence for quick lookup
    const sequenceMap = new Map();
    currentCategoryRelations.forEach((rel) => {
      sequenceMap.set(rel.categoryId, rel.sequence);
    });

    // First, update the main itinerary record with basic fields only
    const updatedItinerary = await prisma.itinerary.update({
      where: { id },
      data: {
        title,
        description,
        shortDescription,
        is_customize: is_customize === null ? false : is_customize,
        city,
        view_images: view_images || [],
        is_hero: is_hero || false,
        duration: duration || 0,
        altitude: altitude || "",
        scenery: scenery || "",
        cultural_sites: cultural_sites || "",
        itin_pdf: itin_pdf || "",
        notes: notes || [],
        is_trending: is_trending || false,
        is_active: is_active || false,
        categoryId: categoryId || [],
        ...(seo_indexed !== undefined && { seo_indexed: seo_indexed ?? true }),
        ...(seo_title !== undefined && { seo_title: seo_title || null }),
        ...(seo_description !== undefined && { seo_description: seo_description || null }),
        ...(seo_keywords !== undefined && { seo_keywords: seo_keywords || null }),
        ...(seo_author !== undefined && { seo_author: seo_author || "safarwanderlust" }),

      },
    });

    // Use a transaction with increased timeout for related data operations
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing related records
      await tx.package.deleteMany({
        where: { itineraryId: id },
      });

      await tx.pickPrice.deleteMany({
        where: { itineraryId: id },
      });

      await tx.dropPrice.deleteMany({
        where: { itineraryId: id },
      });

      await tx.dayDetails.deleteMany({
        where: { itineraryId: id },
      });

      await tx.batch.deleteMany({
        where: { itineraryId: id },
      });

      await tx.LocationsOnItineraries.deleteMany({
        where: { itineraryId: id },
      });

      // DON'T delete CategoriesOnItineraries - we'll preserve the sequence
      // await tx.CategoriesOnItineraries.deleteMany({
      //   where: { itineraryId: id },
      // });

      // Create new related records
      if (base_packages && base_packages.length > 0) {
        await tx.package.createMany({
          data: base_packages.map((pkg) => ({
            name: pkg.name || "",
            original_price: pkg.original_price || 0,
            discounted_price: pkg.discounted_price || 0,
            itineraryId: id,
          })),
        });
      }

      if (pickup_point && pickup_point.length > 0) {
        await tx.pickPrice.createMany({
          data: pickup_point.map((point) => ({
            name: point.name || "",
            price: point.price || 0,
            itineraryId: id,
          })),
        });
      }

      if (drop_point && drop_point.length > 0) {
        await tx.dropPrice.createMany({
          data: drop_point.map((point) => ({
            name: point.name || "",
            price: point.price || 0,
            itineraryId: id,
          })),
        });
      }

      if (hotels && hotels.length > 0) {
        // Filter out empty hotels before creating
        const validHotels = hotels.filter(
          (hotel) =>
            hotel.name &&
            hotel.name.trim() !== "" &&
            hotel.rating > 0 &&
            hotel.reference &&
            hotel.reference.trim() !== "" &&
            hotel.images &&
            hotel.images.some((img) => img && img.trim() !== "")
        );

        if (validHotels.length > 0) {
          await tx.hotel.createMany({
            data: validHotels.map((hotel) => ({
              name: hotel.name,
              rating: hotel.rating,
              images: hotel.images,
              reference: hotel.reference,
              itineraryId: id,
            })),
          });
        }
      }

      if (batches && batches.length > 0) {
        await tx.batch.createMany({
          data: batches.map((batch) => ({
            start_date: batch.start_date,
            end_date: batch.end_date,
            is_sold: batch.is_sold || false,
            extra_amount: batch.extra_amount || 0,
            extra_reason: batch.extra_reason || "",
            itineraryId: id,
          })),
        });
      }

      if (locationIds && locationIds.length > 0) {
        await tx.LocationsOnItineraries.createMany({
          data: locationIds.map((locationId) => ({
            locationId,
            itineraryId: id,
          })),
        });
      }

      if (categoryId && categoryId.length > 0) {
        const currentCategoryIds = currentCategoryRelations.map(
          (rel) => rel.categoryId
        );

        const categoriesToRemove = currentCategoryIds.filter(
          (catId) => !categoryId.includes(catId)
        );

        const categoriesToAdd = categoryId.filter(
          (catId) => !currentCategoryIds.includes(catId)
        );

        if (categoriesToRemove.length > 0) {
          await tx.CategoriesOnItineraries.deleteMany({
            where: {
              itineraryId: id,
              categoryId: { in: categoriesToRemove },
            },
          });
        }

        // Add new categories with proper sequence
        if (categoriesToAdd.length > 0) {
          for (const catId of categoriesToAdd) {
            // Get the highest sequence number for this category
            const maxSequence = await tx.CategoriesOnItineraries.aggregate({
              where: { categoryId: catId },
              _max: { sequence: true },
            });

            // Add the itinerary to the category with sequence = max + 1
            await tx.CategoriesOnItineraries.create({
              data: {
                categoryId: catId,
                itineraryId: id,
                sequence: (maxSequence._max.sequence || -1) + 1,
              },
            });
          }
        }
      } else {
        await tx.CategoriesOnItineraries.deleteMany({
          where: { itineraryId: id },
        });
      }

      // Handle day_details with activities
      if (day_details && day_details.length > 0) {
        for (const detail of day_details) {
          const createdDayDetail = await tx.dayDetails.create({
            data: {
              day: detail.day,
              title: detail.title,
              description: formatDescriptionAsList(detail.description),
              places: detail.places || [],
              itineraryId: id,
            },
          });

          if (detail.activiteis && detail.activiteis.length > 0) {
            await tx.activities.createMany({
              data: detail.activiteis.map((activity) => ({
                description: activity.description,
                images: activity.images || [],
                dayId: createdDayDetail.id,
              })),
            });
          }
        }
      }

      // Handle inclusions_exclusions
      if (inclusions_exclusions) {
        await tx.inclusionsExclusions.upsert({
          where: {
            itineraryId: id,
          },
          update: {
            inclusions: inclusions_exclusions.inclusions || [],
            exclusions: inclusions_exclusions.exclusions || [],
          },
          create: {
            inclusions: inclusions_exclusions.inclusions || [],
            exclusions: inclusions_exclusions.exclusions || [],
            itineraryId: id,
          },
        });
      }

      return updatedItinerary;
    });

    return result;
  } catch (error) {
    console.error("Error updating itinerary:", error);
    throw error;
  }
};

const GetDashboardData = async () => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const currentMonth = new Date().getMonth(); // 0-indexed, so Jan = 0
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle January

  // Batch all queries
  let [
    totalCurrentYearData,
    totalPreviousYearData,
    totalDataCurrentMonth,
    totalDataPreviousMonth,
    recentTopFiveBookings,
    yearlyDataForGraph,
    customRequestRecentTen,
    activeBannersCount,
    expiredBannersCount,
    totalClicksData,
    totalActiveItinerariesCount,
  ] = await Promise.all([
    prisma.dashboardData.findFirst({
      where: { current_year: `${currentYear}` },
      select: {
        total_bookings: true,
        total_requests: true,
        total_revenue: true,
      },
    }),
    prisma.dashboardData.findFirst({
      where: { current_year: `${previousYear}` },
      select: {
        total_bookings: true,
        total_requests: true,
        total_revenue: true,
      },
    }),
    prisma.dashboardData.findFirst({
      where: { current_year: `${currentYear}` },
      select: {
        monthly_data: {
          where: { month: Constant.MONTH[currentMonth] },
          select: {
            bookings: true,
            revenue: true,
            requests: true,
          },
        },
      },
    }),
    prisma.dashboardData.findFirst({
      where: { current_year: `${currentYear}` },
      select: {
        monthly_data: {
          where: { month: Constant.MONTH[previousMonth] },
          select: {
            bookings: true,
            revenue: true,
            requests: true,
          },
        },
      },
    }),
    prisma.bookings.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        transaction_status: true,
        customer: { select: { name: true } },
        total_price: true,
        createdAt: true,
      },
    }),
    prisma.dashboardData.findFirst({
      where: { current_year: `${currentYear}` },
      select: {
        monthly_data: {
          select: {
            month: true,
            bookings: true,
            revenue: true,
            requests: true,
          },
        },
      },
    }),
    prisma.requests.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        destination: true,
        start_date: true,
        people_count: true,
        travel_mode: true,
        status: true,
      },
    }),
    prisma.banner.count({ where: { is_active: true } }),
    prisma.banner.count({ where: { is_active: false } }),
    prisma.banners.findFirst({ select: { total_clicks: true } }),
    prisma.itinerary.count({ where: { is_active: true, deleted: false } }),
  ]);

  // Fallbacks for null data
  const fallbackData = {
    total_bookings: 0,
    total_requests: 0,
    total_revenue: 0,
  };
  const currentYearData = totalCurrentYearData ?? fallbackData;
  const previousYearData = totalPreviousYearData ?? fallbackData;

  // Process year data
  const currentYearMetrics = {
    bookings: [
      currentYearData.total_bookings,
      currentYearData.total_bookings >= previousYearData.total_bookings,
    ],
    requests: [
      currentYearData.total_requests,
      currentYearData.total_requests >= previousYearData.total_requests,
    ],
    revenue: [
      currentYearData.total_revenue,
      currentYearData.total_revenue >= previousYearData.total_revenue,
    ],
  };

  // Process month data
  const fallbackMonthData = [{ bookings: 0, revenue: 0, requests: 0 }];
  const currentMonthMetrics =
    totalDataCurrentMonth?.monthly_data ?? fallbackMonthData;
  const previousMonthMetrics =
    totalDataPreviousMonth?.monthly_data ?? fallbackMonthData;

  const currentMonthData = {
    bookings: [
      currentMonthMetrics[0]?.bookings,
      currentMonthMetrics[0]?.bookings >= previousMonthMetrics.bookings,
    ],
    requests: [
      currentMonthMetrics[0]?.requests,
      currentMonthMetrics[0]?.requests >= previousMonthMetrics.requests,
    ],
    revenue: [
      currentMonthMetrics[0]?.revenue,
      currentMonthMetrics[0]?.revenue >= previousMonthMetrics.revenue,
    ],
  };

  // Handle missing months in yearly data for graph
  if (!yearlyDataForGraph) {
    yearlyDataForGraph = { monthly_data: [] };
  }

  // Handle missing months in yearly data for graph
  const monthsInGraph =
    yearlyDataForGraph.monthly_data.map((data) => data.month) ?? [];
  const missingMonths = Constant.MONTH.filter(
    (month) => !monthsInGraph.includes(month)
  );

  missingMonths.forEach((month) => {
    yearlyDataForGraph.monthly_data.push({
      month,
      bookings: 0,
      revenue: 0,
      requests: 0,
    });
  });

  const promotionalOffers = {
    activeBanners: activeBannersCount,
    expiredBanners: expiredBannersCount,
    totalClicks: totalClicksData?.total_clicks ?? 0,
  };
  console.log(yearlyDataForGraph);

  return {
    currentYearData: currentYearMetrics,
    currentMonthData,
    recentTopFiveBookings,
    yearlyDataForGraph,
    customRequestRecentTen,
    promotionalOffers,
    total_active_itineraries: totalActiveItinerariesCount,
  };
};

const AddOfferBanner = async ({
  image,
  title,
  category_id,
  expire_at,
  route_map,
  category_name,
}) => {
  const banner = await prisma.banner.create({
    data: {
      image,
      title,
      category_id,
      expire_at,
      route_map,
      category_name,
    },
  });
  return banner;
};

const UpdateHomePageCategory = async ({ categories }) => {
  console.log(categories);
  const [cat, updatedCategories] = await prisma.$transaction([
    prisma.categories.updateMany({
      where: {
        is_home: true,
      },
      data: {
        is_home: false,
      },
    }),

    prisma.categories.updateMany({
      where: {
        id: {
          in: categories.map((category) => category),
        },
      },
      data: {
        is_home: true,
      },
    }),
  ]);
  return updatedCategories;
};

const AddSaleOffers = async ({
  end_date,
  title,
  max_discount,
  itineraries,
}) => {
  //check is currentdate== start date
  let is_active = false;
  if (start_date == new Date()) {
    is_active = true;
  }
  const offer = await prisma.sale_offers.create({
    data: {
      start_date,
      end_date,
      title,
      max_discount,
      is_active,
      itineraries,
    },
  });
  await prisma.itinerary.updateMany({
    where: {
      id: {
        in: itineraries.map((itinerary) => itinerary),
      },
      deleted: false,
    },
    data: {
      on_sale: true,
    },
  });
  return offer;
};

const MarkBatchSold = async ({ id }) => {
  await prisma.batch.update({
    where: {
      id,
    },
    data: {
      is_sold: true,
    },
  });
  return true;
};
const UpdateHeroItin = async ({ itineraries }) => {
  const [itin, updatedItin] = await prisma.$transaction([
    prisma.itinerary.updateMany({
      where: {
        is_hero: true,
        deleted: false,
      },
      data: {
        is_hero: false,
      },
    }),
    prisma.itinerary.updateMany({
      where: {
        id: {
          in: itineraries.map((itinerary) => itinerary),
        },
        deleted: false,
      },
      data: {
        is_hero: true,
        is_active: true,
      },
    }),
  ]);
  console.log(itin);
  console.log("seoeragor");
  console.log(updatedItin);
  return updatedItin;
};

const UpdateRequestStatus = async ({ id, isCall, status }) => {
  const client = JSON.parse(isCall || false)
    ? prisma.callbackRequests
    : prisma.requests;

  const request = await client.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
  return request;
};
const GetRequests = async ({ cursor, limit, status, isCall }) => {
  limit = Number(limit) || 10;

  const client = JSON.parse(isCall || false)
    ? prisma.callbackRequests
    : prisma.requests;
  const requestsCount = await client.count();
  const totalPages = Math.ceil(requestsCount / limit);

  const requests = await client.findMany({
    where: {
      status,
    },
    take: limit + 1, // Fetch one more record to check if there's a next page
    skip: 0, // Skip the cursor if it exists
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  let nextCursor = null;
  if (requests.length > limit) {
    const nextReq = requests.pop();
    nextCursor = nextReq.id;
  }
  const isFirstPage = !cursor;
  let previousCursor = null;
  if (cursor) {
    const prevRequests = await client.findMany({
      take: limit, // Fetch the previous set of items
      cursor: { id: cursor }, // Start from the current cursor
      skip: 1,
      where: {
        status,
      },

      orderBy: [
        {
          createdAt: "asc",
        },
      ],
    });
    if (prevRequests.length > 0) {
      previousCursor = prevRequests[prevRequests.length - 1].id;
    }
  }

  // Determine if it's the last page
  const isLastPage = !nextCursor;
  const currentPage = cursor
    ? Math.ceil(
        (await client.count({
          where: {
            status,
            createdAt: {
              lt: requests[requests.length - 1].createdAt,
            },
          },
        })) / limit
      )
    : 1;
  const total_request_current_year = await prisma.dashboardData.findFirst({
    where: {
      current_year: `${new Date().getFullYear()}`,
    },
    select: {
      total_requests: true,
    },
  });
  const total_request_prev_year = await prisma.dashboardData.findFirst({
    where: {
      current_year: `${new Date().getFullYear() - 1}`,
    },
    select: {
      total_requests: true,
    },
  });
  const total_pending_callback = await prisma.requests.count({
    where: {
      status: "REQUESTED",
      createdAt: {
        gte: new Date(new Date(new Date().setDate(1)).setMonth(1)),
      },
    },
  });
  const total_pending_custom = await prisma.callbackRequests.count({
    where: {
      status: "REQUESTED",
      createdAt: {
        gte: new Date(new Date(new Date().setDate(1)).setMonth(1)),
      },
    },
  });
  const total_pending_request = total_pending_callback + total_pending_custom;
  return {
    requests,
    nextCursor,
    previousCursor,
    currentCount: requests.length,
    isFirstPage,
    isLastPage,
    currentPage,
    totalPages,
    total_request_current_year: {
      total_request_current_year: total_request_current_year.total_requests,
      is_up:
        total_request_prev_year?.total_requests ||
        0 < total_request_current_year.total_requests,
    },
    total_pending_request,
  };
};

const toggleItinerariesActiveOrInactive = async ({ id }) => {
  const itinerary = await prisma.itinerary.findUnique({
    where: {
      id,
      deleted: false,
    },
  });
  const is_active = !itinerary.is_active;
  await prisma.itinerary.update({
    where: {
      id,
      deleted: false,
    },
    data: {
      is_active,
    },
  });
  return is_active;
};

const UpdateOfferHeadline = async ({ title, is_active }) => {
  console.log(is_active);
  is_active = JSON.parse(is_active);

  const contents = await prisma.contents.findFirst({});
  console.log("hello", contents);
  if (contents) {
    await prisma.contents.update({
      where: {
        id: contents.id,
      },
      data: {
        offer_headline: contents.offer_headline
          ? {
              update: {
                title,
                is_active,
              },
            }
          : {
              create: {
                title,
                is_active,
              },
            },
      },
    });
  } else {
    const content = await prisma.contents.create({
      data: {
        offer_headline: {
          create: {
            title,
            is_active,
          },
        },
      },
    });
  }
  return is_active;
};
const UpdateTermsConditions = async ({ terms }) => {
  const contents = await prisma.contents.findFirst({});
  console.log("hellocontents");
  if (contents) {
    await prisma.contents.update({
      where: {
        id: contents.id,
      },
      data: {
        terms_and_conditions: terms,
      },
    });
  } else {
    await prisma.contents.create({
      data: {
        terms_and_conditions: terms,
        offer_headline: {
          create: {
            title: "",
            is_active: false,
          },
        },
      },
    });
  }
  return true;
};

const UpdateGalleryImages = async ({ image, is_center }) => {
  const travel_gall = await prisma.travelGallery.create({
    data: {
      images: image,
      is_center: is_center,
    },
  });
  const contents = await prisma.contents.findFirst({});
  if (contents) {
    await prisma.contents.update({
      where: {
        id: contents.id,
      },
      data: {
        gallery: {
          connect: {
            id: travel_gall.id,
          },
        },
      },
    });
  } else {
    await prisma.contents.create({
      data: {
        gallery: {
          connect: {
            id: travel_gall.id,
          },
        },
        offer_headline: {
          create: {
            title: "",
            is_active: false,
          },
        },
      },
    });
  }
  return travel_gall;
};
const DeleteTravelGalleryImage = async ({ id }) => {
  await prisma.travelGallery.delete({
    where: {
      id,
    },
  });
  return true;
};

const GetContentsPageData = async () => {
  const [
    contents,
    cancellation_policy,
    featured_itineraries,
    active_itineraries,
    featured_categories,
    all_categories,
    explore_categories,
    activeBannersCount,
    expiredBannersCount,
    totalClicksData,
  ] = await Promise.all([
    prisma.contents.findFirst({
      select: {
        terms_and_conditions: true,
        gallery: {
          select: {
            id: true,
            images: true,
            is_center: true,
          },
        },
        offer_headline: {
          select: {
            title: true,
            is_active: true,
          },
        },
      },
    }),
    prisma.cancellationPolicy.findFirst({}),
    prisma.itinerary.findMany({
      where: {
        is_hero: true,
        deleted: false,
      },
      select: {
        title: true,
        duration: true,
        city: true,
        is_hero: true,
        is_active: true,
        is_trending: true,
        id: true,
      },
    }),
    prisma.itinerary.findMany({
      where: {
        is_hero: false,
        is_active: true,
        deleted: false,
      },
      select: {
        title: true,
        duration: true,
        city: true,
        is_hero: true,
        is_active: true,
        is_trending: true,
        id: true,
      },
    }),
    prisma.categories.findMany({
      where: {
        is_home: true,
      },
      select: {
        name: true,
        id: true,
      },
    }),
    prisma.categories.findMany({
      select: {
        name: true,
        id: true,
        is_nav: true,
        is_home: true,
      },
    }),
    prisma.categories.findMany({
      where: {
        is_nav: true,
      },
      select: {
        name: true,
        id: true,
      },
    }),
    prisma.banner.count({ where: { is_active: true } }),
    prisma.banner.count({ where: { is_active: false } }),
    prisma.banners.findFirst({ select: { total_clicks: true } }),
  ]);
  let banners = await prisma.banner.findMany({
    select: {
      id: true,
      title: true,
      is_active: true,
      category_id: true,
      category_name: true,
      expire_at: true,
    },
  });

  return {
    contents,
    cancellation_policy,
    featured_itineraries,
    active_itineraries,
    featured_categories,
    all_categories,
    explore_categories,
    activeBannersCount,
    expiredBannersCount,
    totalClicksData,
    banners,
  };
};

const ToggleTrendingItinerary = async ({ id, is_trending }) => {
  console.log(id);
  console.log(is_trending);
  is_trending = JSON.parse(is_trending);
  console.log(is_trending);
  const itinerary = await prisma.itinerary.update({
    where: {
      id,
      deleted: false,
    },
    data: {
      is_trending: is_trending,
    },
  });
  return {
    itinerary,
    is_trending,
  };
};

const GetAllAdmins = async () => {
  const admins = await prisma.admin.findMany();
  return admins;
};

const ToggleAdminRole = async ({ id, role }) => {
  const admin = await prisma.admin.update({
    where: {
      id,
    },
    data: {
      role,
    },
  });
  return admin;
};

const DeleteAdmin = async ({ id }) => {
  await prisma.admin.delete({
    where: {
      id,
    },
  });
  return true;
};
const GetAllBookings = async ({ itinerary_id, batch_id, cursor, limit }) => {
  limit = Number(limit) || 10;

  const bookingCount = await tempPrisma.bookings.count({
    where: {
      itinerary_id: itinerary_id,
      batch_id: batch_id,
    },
  });
  const totalPages = Math.ceil(bookingCount / limit);

  const bookings = await tempPrisma.bookings.findMany({
    take: limit + 1,
    skip: 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    where: {
      itinerary_id,
      batch_id,
    },
    select: {
      id: true,
      customer: {
        select: {
          name: true,
          starting_point: true,
          drop_point: true,
          package_id: true,
        },
      },
      paid_amount: true,
      transaction_status: true,
      total_price: true,
      createdAt: true,
      batch_id: true,
      itinerary_id: true,
    },
  });
  let nextCursor = null;
  if (bookings.length > limit) {
    lastBooking = bookings.pop();
    nextCursor = lastBooking.id;
  }
  let previousCursor = null;
  if (cursor) {
    const prevBookings = await tempPrisma.bookings.findMany({
      take: limit, // Fetch the previous set of items
      cursor: { id: cursor }, // Start from the current cursor
      skip: 1,
      where: {
        itinerary_id,
        batch_id,
      },
      orderBy: [
        {
          createdAt: "asc",
        },
      ],
    });
    if (prevBookings.length > 0) {
      previousCursor = prevBookings[prevBookings.length - 1].id;
    }
  }
  const isFirstPage = !cursor;

  // Determine if it's the last page
  const isLastPage = !nextCursor;

  const currentPage = cursor
    ? Math.ceil(
        (await tempPrisma.bookings.count({
          where: {
            itinerary_id,
            batch_id,
            createdAt: {
              lt: bookings[bookings.length - 1].createdAt,
            },
          },
        })) / limit
      )
    : 1;
  const itineraries = await tempPrisma.itinerary.findMany({
    include: {
      batches: true,
    },
  });
  return {
    bookings,
    previousCursor,
    nextCursor,
    currentCount: bookings.length,
    isFirstPage,
    isLastPage,
    currentPage,
    totalPages,
    itineraries,
  };
};
const GetBookingById = async ({ id }) => {
  const booking = await tempPrisma.bookings.findUnique({
    where: {
      id,
    },
    include: {
      customer: true,
      travellers: true,

      transaction: true,
    },
  });
  const itinerary = await tempPrisma.itinerary.findUnique({
    where: {
      id: booking.itinerary_id,
    },
    select: {
      title: true,
      batches: {
        where: {
          id: booking.batch_id,
        },
        select: {
          start_date: true,
          end_date: true,
        },
      },
    },
  });
  booking.customer.package_name = await tempPrisma.package.findUnique({
    where: {
      id: booking.customer.package_id,
    },
    select: {
      name: true,
    },
  });
  booking.customer.package_name = booking.customer.package_name?.name;
  const travellers = [];
  for (const traveller of booking.travellers) {
    traveller.package_name = await tempPrisma.package.findUnique({
      where: {
        id: traveller.package_id,
      },
      select: {
        name: true,
      },
    });
    traveller.package_name = traveller.package_name?.name;
    travellers.push(traveller);
  }
  booking.travellers = travellers;

  booking.itinerary = itinerary;
  return booking;
};

const DeleterCategoryById = async ({ id }) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // First, delete all keyPoints related to this category
      await tx.keyPoints.deleteMany({
        where: {
          categoryId: id,
        },
      });

      const category = await tx.categories.delete({
        where: {
          id,
        },
      });

      return category;
    });

    return result;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
const PartiallyDeleteItinerary = async ({ id }) => {
  const result = prisma.$transaction(async (tx) => {
    const itinerary = await tx.itinerary.delete({
      where: {
        id,
      },
    });

    await tx.pickPrice.deleteMany({
      where: {
        itineraryId: itinerary.id,
      },
    });
    await tx.dropPrice.deleteMany({
      where: {
        itineraryId: itinerary.id,
      },
    });
    await tx.hotel.deleteMany({
      where: {
        itineraryId: itinerary.id,
      },
    });
    await tx.dayDetails.deleteMany({
      where: {
        itineraryId: itinerary.id,
      },
    });
    await tx.categoriesOnItineraries.deleteMany({
      where: {
        itineraryId: itinerary.id,
      },
    });
    await tx.inclusionsExclusions.deleteMany({
      where: {
        itineraryId: itinerary.id,
      },
    });

    return itinerary;
  });
  return result;
};

const UpdateNavCategories = async ({ categories }) => {
  const [cat, updatedCategories] = await prisma.$transaction([
    prisma.categories.updateMany({
      where: {
        is_nav: true,
      },
      data: {
        is_nav: false,
      },
    }),

    prisma.categories.updateMany({
      where: {
        id: {
          in: categories.map((category) => category),
        },
      },
      data: {
        is_nav: true,
      },
    }),
  ]);
  return updatedCategories;
};
const UpdateCancellationPolicy = async ({ policies }) => {
  const policy = await prisma.cancellationPolicy.findFirst();
  if (policy) {
    await prisma.cancellationPolicy.update({
      where: {
        id: policy.id,
      },
      data: {
        policies,
      },
    });
  } else {
    await prisma.cancellationPolicy.create({
      data: {
        policies,
      },
    });
  }
  return true;
};
const GetAllItinNames = async () => {
  const itineraries = await prisma.itinerary.findMany({
    where: {
      is_active: true,
      deleted: false,
    },
    select: {
      title: true,
      id: true,
    },
  });
  return itineraries;
};

const DeleteBanner = async ({ id }) => {
  console.log("Deleting banner with ID:", id);

  await prisma.$transaction(async (tx) => {
    // Use string ID (assuming your schema uses String for id)
    const banner = await tx.banner.delete({
      where: {
        id: id,
      },
    });

    const banners = await tx.banners.findFirst();

    if (!banners) {
      console.error(" No entry found in banners table");
      return;
    }

    await tx.banners.update({
      where: {
        id: banners.id,
      },
      data: {
        total_clicks: {
          decrement: banner.click_count || 0,
        },
      },
    });
  });

  return true;
};

const EditCategoryOrderByIndexUpdate = async ({ categories }) => {
  const catLeng = await prisma.categories.count();
  if (catLeng != categories.length) {
    throw new Error("Categories length mismatch");
  }
  const updatedCategories = await prisma.$transaction(
    categories.map((category, index) =>
      prisma.categories.update({
        where: {
          id: category.id,
        },
        data: {
          index: category.index,
        },
      })
    )
  );
  return updatedCategories;
};

// {Add for the Enquiry}
const GetAllEnquiries = async () => {
  try {
    const enquiries = await prisma.callbackRequest.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        destination: true,
        travelDate: true,
        travelers: true,
        itinerary_title: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("Fetched enquiries from database:", enquiries);

    return {
      success: true,
      message: "ENQUIRIES_FETCHED",
      data: enquiries,
    };
  } catch (error) {
    console.error("GetAllEnquiries error:", error);
    throw new Error("Failed to fetch enquiries");
  }
};
const slugify = (s) =>
  (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .slice(0, 50) || "slide";

const GetAllCustomizeEnquiries = async () => {
  try {
    const enquiries = await prisma.callbackRequest.findMany({
      where: {
        enquiry_type: "customize",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        destination: true,
        travelDate: true,
        travelers: true,
        itinerary_title: true,
        callback_request: true,
        remark: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "CUSTOMIZE_ENQUIRIES_FETCHED",
      data: enquiries,
    };
  } catch (error) {
    console.error("GetAllCustomizeEnquiries error:", error);
    throw new Error("Failed to fetch customize enquiries");
  }
};

const GetAllInstalinkEnquiries = async () => {
  try {
    const enquiries = await prisma.callbackRequest.findMany({
      where: {
        enquiry_type: {
          in: ["instalink", "itinerary"],
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        destination: true,
        travelDate: true,
        travelers: true,
        itinerary_title: true,
        itinerary_image: true,
        itinerary_id: true,
        enquiry_type: true,
        callback_request: true,
        remark: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "INSTALINK_ENQUIRIES_FETCHED",
      data: enquiries,
    };
  } catch (error) {
    console.error("GetAllInstalinkEnquiries error:", error);
    throw new Error("Failed to fetch instalink enquiries");
  }
};

const CreateHeroSlide = async ({
  title,
  description,
  background,
  cards,
  index,
}) => {
  if (!title || !description || !background || !cards || cards.length !== 3) {
    throw new Error("INVALID_HERO_PAYLOAD");
  }

  // Validate that all cards have URLs
  if (cards.some((card) => !card || card.trim() === "")) {
    throw new Error("All 3 card images are required");
  }

  const key = slugify(title);

  const slide = await prisma.heroSlide.create({
    data: {
      key,
      title,
      description,
      background,
      cards,
      index: index || 0,
    },
  });

  return slide;
};

const UpdateHeroSlide = async ({ id, ...data }) => {
  if (data.cards && data.cards.filter(Boolean).length !== 3) {
    throw new Error("INVALID_CARDS_LENGTH");
  }
  // if title provided, keep key consistent
  if (data.title && !data.key) data.key = slugify(data.title);
  const slide = await prisma.heroSlide.update({ where: { id }, data });
  return slide;
};
const DeleteHeroSlide = async ({ id }) => {
  await prisma.heroSlide.delete({ where: { id } });
  return true;
};
const ListHeroSlides = async () => {
  return await prisma.heroSlide.findMany({
    orderBy: [{ index: "asc" }, { createdAt: "asc" }],
  });
};

// Add the location page in the table
const CreateLocation = async ({
  name,
  description,
  short_description,
  is_home,
  image,
  banner_image,
  route_map,
  is_nav,
  index,
  itineraryIds = [],
  seo_indexed = true,
  seo_title,
  seo_description,
  seo_keywords,
  seo_author = "Safarwanderlust",
}) => {
  if (!name || !image) throw new Error("INVALID_LOCATION_PAYLOAD");
  const existing = await prisma.location.findFirst({ where: { name } });
  if (existing) throw new Error("LOCATION_EXISTS");

  const data = {
    name,
    description,
    short_description,
    is_home: !!is_home,
    image,
    banner_image,
    route_map: route_map || name.toLowerCase().trim().replace(/\s+/g, "-"),
    is_nav: !!is_nav,
    index: index ?? 0,
    seo_indexed: seo_indexed !== false,
    seo_title: seo_title || null,
    seo_description: seo_description || null,
    seo_keywords: seo_keywords || null,
    seo_author: seo_author || "Safarwanderlust",
    itineraries: itineraryIds.length
      ? {
          create: itineraryIds.map((id) => ({
            itinerary: { connect: { id } },
          })),
        }
      : undefined,
  };

  const loc = await prisma.location.create({ data });
  return loc;
};

const UpdateLocation = async (id, data) => {
  if (!id) throw new Error("INVALID_LOCATION_ID");
  if (data.name && !data.route_map) {
    data.route_map = data.name.toLowerCase().trim().replace(/\s+/g, "-");
  }
  const loc = await prisma.location.update({ where: { id }, data });
  return loc;
};

const DeleteLocation = async (id) => {
  if (!id) throw new Error("INVALID_LOCATION_ID");
  await prisma.LocationsOnItineraries.deleteMany({ where: { locationId: id } });
  await prisma.location.delete({ where: { id } });
  return true;
};

// Replace the ListLocations function (around lines 2015-2059)
const ListLocations = async ({ q, skip = 0, take = 50 } = {}) => {
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};
  
  try {
    
    const [rawItems, total] = await Promise.all([
      prisma.location.findMany({
        where,
        orderBy: [{ index: "asc" }, { createdAt: "desc" }],
        skip,
        take,
      }),
      prisma.location.count({ where }),
    ]);

    
    const items = await Promise.all(
      rawItems.map(async (loc) => {
        try {
          // Get all location-itinerary relations for this location
          const locationItineraries = await prisma.locationsOnItineraries.findMany({
            where: { locationId: loc.id },
            select: {
              itineraryId: true,
            },
          });

          // Extract itinerary IDs and fetch valid itineraries
          const itineraryIds = locationItineraries
            .map((li) => li.itineraryId)
            .filter((id) => id !== null && id !== undefined);

          if (itineraryIds.length === 0) {
            return {
              ...loc,
              itineraries: [],
            };
          }

          // Fetch only existing itineraries
          const validItineraries = await prisma.itinerary.findMany({
            where: {
              id: { in: itineraryIds },
            },
            select: {
              id: true,
              title: true,
              city: true,
              duration: true,
              is_active: true,
            },
          });

          return {
            ...loc,
            itineraries: validItineraries,
          };
        } catch (err) {
          // If there's an error fetching itineraries for this location, return empty array
          console.error(`Error fetching itineraries for location ${loc.id}:`, err);
          return {
            ...loc,
            itineraries: [],
          };
        }
      })
    );

    return { items, total };
  } catch (error) {
    console.error("Error in ListLocations:", error);
    throw error;
  }
};

const SetLocationItineraries = async (id, itineraryIds = []) => {
  if (!id) throw new Error("INVALID_LOCATION_ID");
  await prisma.LocationsOnItineraries.deleteMany({ where: { locationId: id } });
  if (itineraryIds.length) {
    await prisma.LocationsOnItineraries.createMany({
      data: itineraryIds.map((itineraryId) => ({
        locationId: id,
        itineraryId,
      })),
    });
  }
  return true;
};

const EditLocationOrderByIndexUpdate = async ({ locations }) => {
  const count = await prisma.location.count();
  if (count != locations.length) throw new Error("Locations length mismatch");
  const updated = await prisma.$transaction(
    locations.map((loc) =>
      prisma.location.update({
        where: { id: loc.id },
        data: { index: loc.index },
      })
    )
  );
  return updated;
};

const UpdateLeadConversionStatus = async (leadId, isConverted) => {
  try {
    const updatedLead = await prisma.callbackRequest.update({
      where: { id: leadId },
      data: { isConverted: isConverted },
    });

    return {
      success: true,
      message: "LEAD_CONVERSION_UPDATED",
      data: updatedLead,
    };
  } catch (error) {
    console.error("UpdateLeadConversionStatus error:", error);
    throw new Error("Failed to update lead conversion status");
  }
};

const UpdateLeadRemark = async (leadId, remark) => {
  try {
    const updatedLead = await prisma.callbackRequest.update({
      where: { id: leadId },
      data: { remark: remark },
    });
    return { success: true, message: "LEAD_REMARK_UPDATED", data: updatedLead };
  } catch (error) {
    console.error("UpdateLeadRemark error:", error);
    throw new Error("Failed to update lead remark");
  }
};

module.exports = {
  ToggleAdminRole,
  GetAllAdmins,
  RegisterAdmin,
  LoginAdmin,
  AddNewCategory,
  AddNewItinerary,
  EditCategoryById,
  EditItineraryById,
  GetDashboardData,
  AddOfferBanner,
  UpdateHomePageCategory,
  MarkBatchSold,
  UpdateHeroItin,
  UpdateRequestStatus,
  GetRequests,
  toggleItinerariesActiveOrInactive,
  UpdateOfferHeadline,
  UpdateTermsConditions,
  UpdateGalleryImages,
  DeleteTravelGalleryImage,
  GetContentsPageData,
  ToggleTrendingItinerary,
  DeleteAdmin,
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
  ListHeroSlides,
  CreateLocation,
  UpdateLocation,
  DeleteLocation,
  ListLocations,
  SetLocationItineraries,
  EditLocationOrderByIndexUpdate,
  GetAllCustomizeEnquiries,
  GetAllInstalinkEnquiries,
  UpdateLeadConversionStatus,
  UpdateLeadRemark,
};
