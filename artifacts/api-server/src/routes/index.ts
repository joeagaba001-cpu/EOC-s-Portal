import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import skillsRouter from "./skills";
import packagesRouter from "./packages";
import enrollmentsRouter from "./enrollments";
import paymentsRouter from "./payments";
import notificationsRouter from "./notifications";
import dashboardRouter from "./dashboard";
import settingsRouter from "./settings";
import announcementsRouter from "./announcements";
import sponsorshipsRouter from "./sponsorships";
import beneficiaryRouter from "./beneficiary";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/users", usersRouter);
router.use("/skills", skillsRouter);
router.use("/packages", packagesRouter);
router.use("/enrollments", enrollmentsRouter);
router.use("/payments", paymentsRouter);
router.use("/notifications", notificationsRouter);
router.use("/dashboard", dashboardRouter);
router.use("/settings", settingsRouter);
router.use("/announcements", announcementsRouter);
router.use("/sponsorships", sponsorshipsRouter);
router.use("/beneficiary", beneficiaryRouter);

export default router;
