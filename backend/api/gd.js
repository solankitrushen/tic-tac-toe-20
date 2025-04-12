import protect from "../middlewares/protect.js";
import gdService from "../services/gd-service.js";

const gd = (app) => {
    const service = new gdService();

    // Create a new Group Discussion
    app.post("/api/v1/gd", protect, async (req, res, next) => {
        try {
            const { status, ...rest } = await service.CreateGD(req.user.userId, req.body);
            return res.status(status).json({ ...rest });
        } catch (err) {
            next(err);
        }
    });


    // Get a specific Group Discussion by ID
    app.get("/api/v1/gd/:gdId", protect, async (req, res, next) => {
        try {
            const { gdId } = req.params;
            const { status, ...rest } = await service.GetGDById(gdId);
            return res.status(status).json({ ...rest });
        } catch (err) {
            next(err);
        }
    });

    // Get all Group Discussions for the current user
    app.get("/api/v1/gd/user/all", protect, async (req, res, next) => {
        try {
            const { status, ...rest } = await service.GetUserGDs(req.user.userId);
            return res.status(status).json({ ...rest });
        } catch (err) {
            next(err);
        }
    });

    // Get all Group Discussions (admin route)
    app.get("/api/v1/gd/admin/all", protect, async (req, res, next) => {
        try {
            // Here you would typically add an admin check middleware
            const { status, ...rest } = await service.GetAllGDs();
            return res.status(status).json({ ...rest });
        } catch (err) {
            next(err);
        }
    });

    // Update a Group Discussion
    app.put("/api/v1/gd/:gdId", protect, async (req, res, next) => {
        try {
            const { gdId } = req.params;
            const { status, ...rest } = await service.UpdateGD(gdId, req.user.userId, req.body);
            return res.status(status).json({ ...rest });
        } catch (err) {
            next(err);
        }
    });

    // Delete a Group Discussion
    app.delete("/api/v1/gd/:gdId", protect, async (req, res, next) => {
        try {
            const { gdId } = req.params;
            const { status, ...rest } = await service.DeleteGD(gdId, req.user.userId);
            return res.status(status).json({ ...rest });
        } catch (err) {
            next(err);
        }
    });

    // Mark a Group Discussion as completed
    app.patch("/api/v1/gd/:gdId/complete", protect, async (req, res, next) => {
        try {
            const { gdId } = req.params;
            const { status, ...rest } = await service.MarkGDAsCompleted(gdId, req.user.userId);
            return res.status(status).json({ ...rest });
        } catch (err) {
            next(err);
        }
    });

    // Cancel a Group Discussion
    app.patch("/api/v1/gd/:gdId/cancel", protect, async (req, res, next) => {
        try {
            const { gdId } = req.params;
            const { status, ...rest } = await service.CancelGD(gdId, req.user.userId);
            return res.status(status).json({ ...rest });
        } catch (err) {
            next(err);
        }
    });

    // Add feedback to a completed Group Discussion
    app.post("/api/v1/gd/:gdId/feedback", protect, async (req, res, next) => {
        try {
            const { gdId } = req.params;
            const { status, ...rest } = await service.AddFeedback(gdId, req.user.userId, req.body);
            return res.status(status).json({ ...rest });
        } catch (err) {
            next(err);
        }
    });
};

export default gd;