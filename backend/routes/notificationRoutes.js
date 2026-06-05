import { getNotifications, markAsRead } from "../controllers/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const Router = express.Router()


Router.get("/getNotifications", authMiddleware, getNotifications)
Router.patch("/markAsRead", authMiddleware, markAsRead);

export default Router;