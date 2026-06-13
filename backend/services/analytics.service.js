import Module from "../models/Module.js";
import Assignment from "../models/Assignment.js";
import Progress from "../models/Progress.js";
import User from "../models/User.js";
import Department from "../models/Department.js";

// ─────────────────────────────────────────────
// GET /api/analytics/overview
// KPIs: total modules, assignments, completion
// rate, avg quiz score, reflection submission rate
// ─────────────────────────────────────────────
export const getOverview = async () => {
  const [
    totalModules,
    totalAssignments,
    totalProgressRecords,
    completedCount,
    quizAttempts,
    reflectionCount,
    totalDepartment,   //modified
    activeUsers, // modified
    overdueTraining   //modified
  ] = await Promise.all([
    Module.countDocuments({ status: "published" }),
    Assignment.countDocuments(),
    Progress.countDocuments({ status: "in progress" }),
    Assignment.countDocuments({ status: "completed" }),
    Progress.countDocuments({ quizAttempted: true }),
    Progress.countDocuments({ reflectionSubmitted: true }),
    Department.countDocuments(), //modified
    User.countDocuments({isActive: true}), //modified
    Assignment.countDocuments({ overdue: true }) //added
  ]);

  // Average quiz score across all attempted records
  const quizScoreAgg = await Progress.aggregate([
    { $match: { quizAttempted: true } },
    { $group: { _id: null, avgScore: { $avg: "$quizScore" } } },
  ]);

  const avgQuizScore =
    quizScoreAgg.length > 0
      ? Math.round(quizScoreAgg[0].avgScore * 10) / 10
      : 0;

  const completionRate =
    totalProgressRecords > 0
      ? Math.round((completedCount / totalProgressRecords) * 100)
      : 0;

  const reflectionSubmissionRate =
    totalProgressRecords > 0
      ? Math.round((reflectionCount / totalProgressRecords) * 100)
      : 0;

  const completedPercentage = completedCount > 0 ? Math.round((completedCount / totalAssignments) * 100) : 0;

  const inProgressPercentage = totalProgressRecords > 0 ? Math.round((totalProgressRecords / totalAssignments) * 100) : 0;

  const notStartedPercentage = 100 - completedPercentage - inProgressPercentage;

  return {
    totalModules,
    totalAssignments,
    totalProgressRecords,
    completedCount,
    completionRate,          // %
    avgQuizScore,            // 0-100
    reflectionSubmissionRate, // %
    totalDepartment,   //modified
    activeUsers,   //modified
    overdueTraining, //added
    completedPercentage, //added
    inProgressPercentage, //added
    notStartedPercentage //added

  };
};


export const getModuleAnalytics = async () => {
  const modules = await Module.find({ status: "published" })
    .select("title description duration createdAt")
    .lean();

  const data = await Promise.all(
    modules.map(async (mod) => {
      const moduleId = mod._id;

      const [
        totalAssigned,
        completed,
        inProgress,
        notStarted,
        quizAttempted,
        reflections,
      ] = await Promise.all([
        Assignment.countDocuments({ moduleId }),
        Assignment.countDocuments({ moduleId, status: "completed" }), //modified
        Assignment.countDocuments({ moduleId, status: "in_progress" }), //modified
        Assignment.countDocuments({ moduleId, status: "not_started" }),  //modified
        Progress.countDocuments({ moduleId, quizAttempted: true }),
        Progress.countDocuments({ moduleId, reflectionSubmitted: true }),
      ]);

      // Avg quiz score for this module
      const quizAgg = await Progress.aggregate([
        { $match: { moduleId, quizAttempted: true } },
        { $group: { _id: null, avg: { $avg: "$quizScore" } } },
      ]);
      const avgQuizScore =
        quizAgg.length > 0 ? Math.round(quizAgg[0].avg * 10) / 10 : 0;

      // Users who have NOT completed this module
      const incompleteProgress = await Progress.find({
        moduleId,
        status: { $ne: "completed" },
      })
        .populate("userId", "name email department")
        .select("userId status quizScore reflectionSubmitted")
        .lean();

      const incompleteUsers = incompleteProgress.map((p) => ({
        user: p.userId,
        status: p.status,
        quizScore: p.quizScore,
        reflectionSubmitted: p.reflectionSubmitted,
      }));

      return {
        module: mod,
        stats: {
          totalAssigned,
          completed,
          inProgress,
          notStarted,
          completionRate:
            totalAssigned > 0
              ? Math.round((completed / totalAssigned) * 100)
              : 0,
          quizAttempted,
          avgQuizScore,
          reflectionSubmissionRate:
            totalAssigned > 0
              ? Math.round((reflections / totalAssigned) * 100)
              : 0,
        },
        incompleteUsers,
      };
    })
  );

  return data;
};

// GET /api/analytics/users
// Per-user: modules assigned, completed,
// avg quiz score, reflection rate
// ─────────────────────────────────────────────
export const getUserAnalytics = async () => {
  const users = await User.find({ isActive: true, role: "employee" })
    .select("name email department")
    .lean();

  const data = await Promise.all(
    users.map(async (user) => {
      const userId = user._id;

      const [assigned, completed, quizAttempted, reflections] =
        await Promise.all([
          Progress.countDocuments({ userId }),
          Progress.countDocuments({ userId, status: "completed" }), //modified
          Progress.countDocuments({ userId, status: true }),
          Progress.countDocuments({ userId, reflectionSubmitted: true }),
        ]);

        if (assigned === completed) { //modified
          await User.findByIdAndUpdate(user._id, {onboardingStatus: "completed", tracking: `${completed} / ${assigned}`}, {new: true})
        } else if (completed > 0 && completed < assigned ) {
          await User.findByIdAndUpdate(user._id, {onboardingStatus: "in progress"}, {new: true})
        } else {
          await User.findByIdAndUpdate(user._id, {onboardingStatus: "not started"}, {new: true})
        } //modified

      const quizAgg = await Progress.aggregate([
        { $match: { userId, quizAttempted: true } },
        { $group: { _id: null, avg: { $avg: "$quizScore" } } },
      ]);
      const avgQuizScore =
        quizAgg.length > 0 ? Math.round(quizAgg[0].avg * 10) / 10 : 0;

      // Modules not yet completed by this user
      const incompleteProgress = await Progress.find({
        userId,
        status: { $ne: "completed" },
      })
        .populate("moduleId", "title")
        .select("moduleId status")
        .lean();

      const incompleteModules = incompleteProgress.map((p) => ({
        module: p.moduleId,
        status: p.status,
      }));

      return {
        user,
        stats: {
          assigned,
          completed,
          tracking: `${completed} / ${assigned}`,
          completionRate:
            assigned > 0 ? Math.round((completed / assigned) * 100) : 0,
          quizAttempted,
          avgQuizScore,
          reflectionSubmissionRate:
            assigned > 0 ? Math.round((reflections / assigned) * 100) : 0,
        },
        incompleteModules,
      };
    })
  );

  return data;
};
