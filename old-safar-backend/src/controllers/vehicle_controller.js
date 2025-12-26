const {
  getFilteredVehicles,
  getVehicles,
  createVehicle,
  updateVehicle,
} = require("../services/vehicles_services");

const getVehiclesController = async (req, res) => {
  return await getVehicles(req, res);
};

const getFilteredVehiclesController = async (req, res) => {
  return await getFilteredVehicles(req, res);
};

const createVehicleController = async (req, res) => {
  return await createVehicle(req, res);
};

const updateVehicleController = async (req, res) => {
  return await updateVehicle(req, res);
};

module.exports = {
  getVehiclesController,
  getFilteredVehiclesController,
  createVehicleController,
  updateVehicleController,
};
