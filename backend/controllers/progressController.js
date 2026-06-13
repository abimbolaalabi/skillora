// TODO: getProgress, updateVideoProgress, submitQuiz, submitReflection, getMyProgress
import User from '../models/User.js';
import Module from '../models/Module.js';
import Progress from '../models/Progress.js';
import Lesson from '../models/Lesson.js';
import Assignment from "../models/Assignment.js";


export const startModule = async (req, res) => {
  const { userId, moduleId } = req.params;

  try {
    const assignment = await Assignment.findOne({ moduleId: moduleId, assignedTo: userId });
    if (!assignment) {
      return res.status(403).json({
        success: false,
        message: 'User is not assigned to this module or assignment does not exist'
      });
    }

    let progress = await Progress.findOne({ userId, moduleId });

    if (!progress) {
      progress = new Progress({
        userId,
        moduleId,
        completionStatus: 'In Progress',
        startedAt: new Date()
      });
      assignment.status = 'in progress';
      await assignment.save();
    } else if (progress.completionStatus === 'Not Started') {
      progress.completionStatus = 'In Progress';
      progress.startedAt = new Date();
    } else {
      return res.json({
        success: true,
        message: 'Module already started',
        startedAt: progress.startedAt,
        progress
      });
    }

    await progress.save();

    res.json({
      success: true,
      message: 'Module started successfully',
      startedAt: progress.startedAt,
      progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getModuleProgress = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user?._id || req.query.userId || req.params.userId;

    if (!moduleId) {
      return res.status(400).json({ success: false, message: 'moduleId is required' });
    }

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required (authenticate or provide userId query param)' });
    }

    const module = await Module.findById(moduleId).lean();
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    const moduleTotalLessons = module.totalLessons || await Lesson.countDocuments({ moduleId });

    const progress = await Progress.findOne({ userId, moduleId })
      .populate('completedLessons.lessonId', 'title duration order')
      .lean();

    if (!progress) {
      return res.json({
        success: true,
        progress: {
          userId,
          moduleId,
          completionStatus: 'Not Started',
          completedLessons: [],
          totalLessons: moduleTotalLessons,
          completedLessonsCount: 0,
          progressPercentage: 0,
          module
        }
      });
    }

    const completedLessonsCount = (progress.completedLessons || []).length;
    const totalLessons = progress.totalLessons || moduleTotalLessons;
    const progressPercentage = totalLessons
      ? Number(((completedLessonsCount / totalLessons) * 100).toFixed(2))
      : 0;

    res.json({
      success: true,
      progress: {
        ...progress,
        totalLessons,
        completedLessonsCount,
        progressPercentage,
        module
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await Progress.find({ userId })
      .populate('moduleId', 'title description totalLessons')
      .lean();

    const modules = await Promise.all(progress.map(async (p) => {
      const completedLessonsCount = (p.completedLessons || []).length;
      const moduleTotalLessons = p.moduleId?.totalLessons || await Lesson.countDocuments({ moduleId: p.moduleId?._id ?? p.moduleId });
      const totalLessons = p.totalLessons || moduleTotalLessons;
      const progressPercentage = totalLessons
        ? Number(((completedLessonsCount / totalLessons) * 100).toFixed(2))
        : 0;

      return {
        moduleId: p.moduleId?._id ?? p.moduleId,
        title: p.moduleId?.title || null,
        description: p.moduleId?.description || null,
        status: p.completionStatus,
        completedLessons: completedLessonsCount,
        totalLessons,
        progressPercentage,
        startedAt: p.startedAt,
        completedAt: p.completedAt
      };
    }));

    res.json({ success: true, modules });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCompletionStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const totalModules = await Module.countDocuments();
    const completed = await Progress.countDocuments({
      userId,
      completionStatus: 'Completed'
    });

    const percentage = totalModules ? Number(((completed / totalModules) * 100).toFixed(2)) : 0;

    res.json({
      success: true,
      completedModules: completed,
      totalModules,
      percentage
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// export const updateProgress = async (req, res) => {
//   const { userId, moduleId, status } = req.body;

//   try {
//     const progress = await Progress.findOneAndUpdate(
//       { userId, moduleId },
//       {
//         completionStatus: status,
//         ...(status === 'Completed' && { completedAt: new Date() })
//       },
//       { upsert: true, new: true }
//     );

//     res.json({ success: true, progress });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

export const getUserDashboard = async (req, res) => {
  const { userId } = req.params;

  try {
    const [progressDocs, assignments] = await Promise.all([
      Progress.find({ userId }).lean(),
      Assignment.find({ assignedTo: userId }).lean()
    ]);

    const assignedModuleIds = assignments.map((assignment) => assignment.moduleId.toString());
    const progressModuleIds = progressDocs.map((p) => p.moduleId.toString());
    const moduleIds = Array.from(new Set([...assignedModuleIds, ...progressModuleIds]));

    if (moduleIds.length === 0) {
      return res.json({
        success: true,
        stats: {
          totalModules: 0,
          notStarted: 0,
          inProgress: 0,
          completed: 0,
          overallPercentage: 0,
          modules: []
        }
      });
    }

    const modules = await Module.find({ _id: { $in: moduleIds } }).lean();
    const progressByModule = new Map(
      progressDocs.map((p) => [p.moduleId.toString(), p])
    );

    const moduleProgress = await Promise.all(
      modules.map(async (module) => {
        const progress = progressByModule.get(module._id.toString());
        const completedLessons = (progress?.completedLessons || []).length;
        const moduleTotalLessons = module.totalLessons || await Lesson.countDocuments({ moduleId: module._id });
        const totalLessons = progress?.totalLessons || moduleTotalLessons || 0;
        const percentage = totalLessons
          ? Number(((completedLessons / totalLessons) * 100).toFixed(2))
          : 0;

        return {
          moduleId: module._id,
          title: module.title,
          description: module.description,
          status: progress?.completionStatus || 'Not Started',
          completedLessons,
          totalLessons,
          progressPercentage: percentage,
          startedAt: progress?.startedAt || null,
          completedAt: progress?.completedAt || null
        };
      })
    );

    const stats = {
      totalModules: modules.length,
      notStarted: moduleProgress.filter((m) => m.status === 'Not Started').length,
      inProgress: moduleProgress.filter((m) => m.status === 'In Progress').length,
      completed: moduleProgress.filter((m) => m.status === 'Completed').length,
      overallPercentage: modules.length
        ? Number(
            (
              moduleProgress.reduce((sum, m) => sum + m.progressPercentage, 0) /
              modules.length
            ).toFixed(2)
          )
        : 0,
      modules: moduleProgress
    };

    // Update onboardingStatus when total module = completed 
    const newOnboardingStatus = stats.totalModules === stats.completed ? 'completed' : 'in progress';
    await User.findByIdAndUpdate(userId, { onboardingStatus: newOnboardingStatus });

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const completeLesson = async (req, res) => {
  try {
    const { userId, moduleId, lessonId } = req.params;
    if (!userId || !moduleId || !lessonId) {
      return res.status(400).json({ success: false, message: 'userId, moduleId and lessonId required' });
    }
    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

    let progress = await Progress.findOne({ userId, moduleId });
    if (!progress) {
      progress = new Progress({
        userId,
        moduleId,
        startedAt: new Date(),
        completionStatus: 'In Progress'
      });
    }
    // avoid duplicate completed entries
    const already = (progress.completedLessons || []).some(c => c.lessonId.toString() === lessonId.toString());
    if (!already) {
      progress.completedLessons.push({ lessonId, completedAt: new Date() });
    }
    // ensure totalLessons is set (fallback to module.totalLessons or count)
    progress.totalLessons = progress.totalLessons || module.totalLessons || (await Lesson.countDocuments({ moduleId }));

    await progress.save();

    res.json({ success: true, progress });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};