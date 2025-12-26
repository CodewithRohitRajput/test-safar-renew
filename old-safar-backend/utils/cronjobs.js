const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({});

const ExpireBannerOnDate = async () => {
  try {
    await prisma.banner.updateMany({
      where: {
        expire_at: {
          lt: new Date(),
        },
      },
      data: {
        is_active: false,
      },
    });
  } catch (err) {
    console.error("Error expiring banners:", err.message);
  }
};

const ExpireBatchesOnStartDate = async () => {
  try {
    await prisma.batch.updateMany({
      where: {
        start_date: {
          lte: new Date(),
        },
      },
      data: {
        is_sold: true,
      },
    });
  } catch (err) {
    console.error("Error expiring batches:", err.message);
  }
};

const GenerateRouteforAllCategories = async () => {
  try {
    const categories = await prisma.categories.findMany();
    
    const updatePromises = categories.map(async (category) => {
      const route_map = category.name.toLowerCase().trim().replace(/\s+/g, "-");
      
      if (category.route_map !== route_map) {
        return prisma.categories.update({
          where: {
            id: category.id,
          },
          data: {
            route_map: route_map,
          },
        });
      }
      return null;
    });
    
    const results = await Promise.all(updatePromises);
    const updatedCount = results.filter(r => r !== null).length;
    
    return { updated: updatedCount, total: categories.length };
  } catch (err) {
    console.error("Error generating routes for categories:", err.message);
    throw err;
  }
};

const DeleterPartiallyDeletedItineraries = async () => {
  try {
    const itineraries = await prisma.itinerary.findMany({
      where: {
        deleted: true,
      },
    });
    for (let i = 0; i < itineraries.length; i++) {
      await prisma.$transaction([
        prisma.batch.deleteMany({
          where: {
            itineraryId: itineraries[i].id,
          },
        }),
        prisma.itinerary.delete({
          where: {
            id: itineraries[i].id,
          },
        }),
      ]);
    }
  } catch (err) {
    console.error("Error deleting partially deleted itineraries:", err.message);
  }
};

const insertIndexValueBasedOnCategoryOrderAsc = async () => {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: {
        name: "asc",
      },
    });
    for (let i = 0; i < categories.length; i++) {
      await prisma.categories.update({
        where: {
          id: categories[i].id,
        },
        data: {
          index: i,
        },
      });
    }
  } catch (err) {
    console.error("Error inserting index values:", err.message);
  }
};

module.exports = {
  ExpireBannerOnDate,
  ExpireBatchesOnStartDate,
  DeleterPartiallyDeletedItineraries,
  insertIndexValueBasedOnCategoryOrderAsc,
};