import * as analyticsService from "../services/analytics.service.js";

//  KPI overview — completion rate, avg quiz score, reflection rate, etc.

export const getOverview = async (req, res) => {
  try {
    const data = await analyticsService.getOverview();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  — completion rates, quiz performance, incomplete users

export const getModuleAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getModuleAnalytics();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  —progress, quiz scores, incomplete modules

export const getUserAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getUserAnalytics();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
