import PersonProfile from "../models/personProfileModel.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

// Create new person profile
export const createPerson = catchAsync(async (req, res, next) => {
  const newPerson = await PersonProfile.create({
    ...req.body,
    customerId: req.user._id,
  });

  res.status(201).json({
    message: "Person profile created successfully",
    data: newPerson,
  });
});

// Get all person profiles for logged-in customer
export const getAllPeople = catchAsync(async (req, res, next) => {
  const people = await PersonProfile.find({
    customerId: req.user._id,
    isDeleted: false,
  });

  res.status(200).json({
    data: people,
  });
});

// Get one person profile by ID
export const getPersonById = catchAsync(async (req, res, next) => {
  const person = await PersonProfile.findOne({
    _id: req.params.id,
    customerId: req.user._id,
    isDeleted: false,
  });

  if (!person) {
    return next(new AppError("Person not found or unauthorized access", 404));
  }

  res.status(200).json({
    data: person,
  });
});

// Update a person profile
export const updatePerson = catchAsync(async (req, res, next) => {
  const updated = await PersonProfile.findOneAndUpdate(
    {
      _id: req.params.id,
      customerId: req.user._id,
      isDeleted: false,
    },
    req.body,
    { new: true }
  );

  if (!updated) {
    return next(new AppError("Person not found or unauthorized access", 404));
  }

  res.status(200).json({
    message: "Profile updated successfully",
    data: updated,
  });
});

// Soft-delete a person profile
export const deletePerson = catchAsync(async (req, res, next) => {
  const deleted = await PersonProfile.findOneAndUpdate(
    {
      _id: req.params.id,
      customerId: req.user._id,
      isDeleted: false,
    },
    { isDeleted: true },
    { new: true }
  );

  if (!deleted) {
    return next(new AppError("Person not found or unauthorized access", 404));
  }

  res.status(200).json({
    message: "Person profile deleted successfully",
  });
});
