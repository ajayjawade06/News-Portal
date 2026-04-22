import AdPlan from '../models/AdPlan.js';
import SystemConfig from '../models/SystemConfig.js';

// --- AD PLANS --- //

// Public: Get all active plans
export const getActivePlans = async (req, res) => {
  try {
    const plans = await AdPlan.find({ isActive: true }).sort({ price: 1 });
    res.json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching plans', error: error.message });
  }
};

// Admin: Get all plans (including inactive)
export const getAllPlansAdmin = async (req, res) => {
  try {
    const plans = await AdPlan.find().sort({ price: 1 });
    res.json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching plans', error: error.message });
  }
};

// Admin: Create a new plan
export const createPlan = async (req, res) => {
  try {
    const { name, internalId, title, price, durationDays, placements, perks, isCustom, isActive } = req.body;
    
    // Check if internalId already exists
    const existing = await AdPlan.findOne({ internalId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Plan with this internal ID already exists' });
    }

    const plan = await AdPlan.create({
      name, internalId, title, price, durationDays, placements, perks, isCustom, isActive
    });

    res.status(201).json({ success: true, message: 'Plan created successfully', data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating plan', error: error.message });
  }
};

// Admin: Update an existing plan
export const updatePlan = async (req, res) => {
  try {
    const plan = await AdPlan.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    
    res.json({ success: true, message: 'Plan updated successfully', data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating plan', error: error.message });
  }
};

// Admin: Delete a plan
export const deletePlan = async (req, res) => {
  try {
    const plan = await AdPlan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    res.json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting plan', error: error.message });
  }
};


// --- GLOBAL SYSTEM CONFIG (Discount) --- //

// Public: Get global settings
export const getSystemConfig = async (req, res) => {
  try {
    let config = await SystemConfig.findOne({ type: 'global_settings' });
    if (!config) {
      // Create default if not exists
      config = await SystemConfig.create({ type: 'global_settings', discountPercentage: 0, isDiscountActive: false });
    }
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching config', error: error.message });
  }
};

// Admin: Update global settings
export const updateSystemConfig = async (req, res) => {
  try {
    const { discountPercentage, isDiscountActive, discountName } = req.body;
    let config = await SystemConfig.findOne({ type: 'global_settings' });
    
    if (!config) {
      config = await SystemConfig.create({ 
        type: 'global_settings', 
        discountPercentage, 
        isDiscountActive,
        discountName
      });
    } else {
      config.discountPercentage = discountPercentage !== undefined ? discountPercentage : config.discountPercentage;
      config.isDiscountActive = isDiscountActive !== undefined ? isDiscountActive : config.isDiscountActive;
      config.discountName = discountName !== undefined ? discountName : config.discountName;
      await config.save();
    }
    
    res.json({ success: true, message: 'Settings updated successfully', data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating config', error: error.message });
  }
};
