import Staff from "../models/Staff.js";

// Create a new staff member
export const createStaff = async (req, res) => {
  try {
    const customerId = req.user._id;
    const employeeData = req.body;
    employeeData.customerId = customerId;
    const staff = await Staff.create(employeeData);
    res.status(201).json(staff);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all staff (with optional filters)
export const getAllStaff = async (req, res) => {
  try {
    const customerId = req.user._id;
    const staffList = await Staff.find({
      customerId: customerId,
    });
    res.json(staffList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single staff member by ID
export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ error: "Staff not found" });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update staff details
export const updateStaff = async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true, runValidators: true }
    );
    if (!updatedStaff)
      return res.status(404).json({ error: "Staff not found" });
    res.json(updatedStaff);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete staff
export const deleteStaff = async (req, res) => {
  try {
    const deleted = await Staff.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Staff not found" });
    res
      .status(200)
      .json({ success: true, message: "Staff deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
