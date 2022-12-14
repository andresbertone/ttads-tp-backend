const ApiError = require("../utils/apiError");
const responseCreator = require("../utils/responseCreator");
const customerService = require("../services/customerService");
const vehicleService = require("../services/vehicleService");


const newVehicle = async (req, res, next) => {
    const licensePlate = req.body.licensePlate;
    const customerId = req.body.customerId;

    try {
        const vehicle = await vehicleService.getVehicleByLicensePlate(licensePlate);

        if (vehicle) {
            throw ApiError.badRequest(`A vehicle with license plate '${licensePlate}' already exists.`);
        }

        const customer = await customerService.getCustomerById(customerId);

        if (!customer) {
            throw ApiError.notFound(`Customer with id '${customerId}' does not exist.`);
        }

        const newVehicle = await vehicleService.createVehicle(req.body);

        const response = responseCreator(newVehicle);

        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};


const deleteVehicle = async (req, res, next) => {
    const vehicleId = req.params.vehicleId;

    try {
        const vehicleToDelete = await vehicleService.getVehicleById(vehicleId);

        if (!vehicleToDelete) {
            throw ApiError.badRequest(`The vehicle with id ${vehicleId} does not exist.`);
        }

        const isVehicleSuitableForDeletion = await vehicleService.isVehicleSuitableForDeletion(vehicleId);

        if (!isVehicleSuitableForDeletion) {
            throw ApiError.badRequest(`The vehicle with id ${vehicleId} cannot be deleted because it has a repair entered or in progress.`);
        }

        await vehicleService.deleteVehicle(vehicleId);

        const response = responseCreator(vehicleToDelete);

        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};


const editVehicle = async (req, res, next) => {
    const vehicleId = req.params.vehicleId;

    try {
        const vehicleToUpdate = await vehicleService.getVehicleById(vehicleId);

        if (!vehicleToUpdate) {
            throw ApiError.badRequest(`The vehicle with id ${vehicleId} does not exist.`);
        }

        if (vehicleToUpdate.licensePlate !== req.body.licensePlate) {
            throw ApiError.badRequest("You cannot change the license plate.");
        }

        if (vehicleToUpdate.customerId != req.body.customerId) {
            throw ApiError.badRequest("You cannot change the vehicle's owner.");
        }

        await vehicleService.editVehicle(req.body, vehicleId);

        const response = responseCreator(vehicleToUpdate);

        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    newVehicle,
    deleteVehicle,
    editVehicle
};