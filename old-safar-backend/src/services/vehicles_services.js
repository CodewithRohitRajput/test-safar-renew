const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

 const getVehicles= async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        skip,
        take: limitInt,
        orderBy: { createdAt: "desc" },
      }),
      prisma.vehicle.count(),
    ]);

    return res.status(200).json({
      data: vehicles,
      total,
      page: pageInt,
      totalPages: Math.ceil(total / limitInt),
    });
  } catch (error) {
    console.error("Vehicle pagination error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}



 const getFilteredVehicles =async (req, res)=> {

  try {
    const { page = 1, limit = 10, ...filters } = req.query;

    const pageInt = parseInt(page );
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;

    // Build Prisma where clause from filters
    const where = {};

    for (const key in filters) {
      if (["page", "limit"].includes(key)) continue;
      if (filters[key]) {
        where[key] = {
          contains: filters[key], // partial match, case-sensitive
          mode: "insensitive",   // case-insensitive
        };
      }
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip,
        take: limitInt,
        orderBy: { createdAt: "desc" },
      }),
      prisma.vehicle.count({ where }),
    ]);

    return res.status(200).json({
      data: vehicles,
      total,
      page: pageInt,
      totalPages: Math.ceil(total / limitInt),
    });
  } catch (error) {
    console.error("Error in vehicle filter+pagination API:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


 const createVehicle =async(req, res)=> {

    try {
      const {
        vType,
        vNumber,
        capacity,
        priceType,
        price,
        routes,
        contact,
        vendorName,
        vendorLocation,
        rating,
      } = req.body;

      // Validation (you can expand this)
      if (!vType || !vNumber || !capacity || !priceType || !price) {
        return res
          .status(400)
          .json({ error: "Missing required fields in request body." });
      }

      const newVehicle = await prisma.vehicle.create({
        data: {
          vType,
          vNumber,
          capacity: Number(capacity),
          priceType,
          price: Number(price),
          routes,
          contact,
          vendorName,
          vendorLocation,
          rating: rating ? Number(rating) : null,
        },
      });

      return res.status(201).json({ data: newVehicle });
    } catch (error) {
      console.error("Vehicle creation error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  
}


 const updateVehicle =async  (req, res)=> {
  const  id  =  req.params.id;
    try {
      const {
        vType,
        vNumber,
        capacity,
        priceType,
        price,
        routes,
        contact,
        vendorName,
        vendorLocation,
        rating,
      } = req.body;

      const existingVehicle = await prisma.vehicle.findUnique({
        where: { id: String(id) },
      });

      if (!existingVehicle) {
        return res.status(404).json({ error: "Vehicle not found." });
      }

      const updatedVehicle = await prisma.vehicle.update({
        where: { id: String(id) },
        data: {
          vType,
          vNumber,
          capacity: capacity !== undefined ? Number(capacity) : undefined,
          priceType,
          price: price !== undefined ? Number(price) : undefined,
          routes,
          contact,
          vendorName,
          vendorLocation,
          rating: rating !== undefined ? Number(rating) : undefined,
        },
      });

      return res.status(200).json({ data: updatedVehicle });
    } catch (error) {
      console.error("Vehicle update error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
 
}

module.exports = {
    getFilteredVehicles, getVehicles, createVehicle, updateVehicle
}