import protect from "../middlewares/protect.js";
import MockInterviewService from "../services/mock-interview-service.js";

const mockInterviewAPI = (app) => {
    const service = new MockInterviewService();

    // Interviewer creates a new session
    app.post("/api/v1/mock-interviews/sessions", protect, async (req, res, next) => {
        try {
            // Only allow interviewers to create sessions
            if (req.user.role !== "interviewer") {
                return res.status(403).json({ message: "Only interviewers can create sessions" });
            }

            const { status, ...rest } = await service.CreateSession(req.user.userId, req.body);
            return res.status(status).json({ ...rest });
        } catch (err) {
            next(err);
        }
    });

    // Interviewer gets their sessions
    app.get("/api/v1/mock-interviews/sessions/me", protect, async (req, res, next) => {
        try {
            // Only allow interviewers to view their sessions
            if (req.user.role !== "interviewer") {
                return res.status(403).json({ message: "Only interviewers can view their sessions" });
            }

            const { status, ...rest } = await service.GetInterviewerSessions(req.user.userId);
            return res.status(status).json({ ...rest });
        } catch (err) {
            next(err);
        }
    });

    // Get all available sessions (for candidates to browse)
    app.get("/api/v1/mock-interviews/sessions/available", protect, async (req, res, next) => {
        try {
            const { status, ...rest } = await service.GetAllAvailableSessions();
            return res.status(status).json({ ...rest });
        } catch (err) {
            next(err);
        }
    });

    // Candidate books a session
    app.post("/api/v1/mock-interviews/sessions/:sessionId/book", protect, async (req, res, next) => {
        try {
            const { sessionId } = req.params;
            const { status, ...rest } = await service.BookSession(sessionId, req.user, req.body);
            return res.status(status).json({ ...rest });
        } catch (err) {
            next(err);
        }
    });

    // Candidate cancels a booking
    app.post("/api/v1/mock-interviews/sessions/:sessionId/cancel", protect, async (req, res, next) => {
        try {
            const { sessionId } = req.params;
            const { status, ...rest } = await service.CancelBooking(sessionId, req.user, req.body);
            return res.status(status).json({ ...rest });
        } catch (err) {
            next(err);
        }
    });

    // Interviewer updates their session
    app.put("/api/v1/mock-interviews/sessions/:sessionId", protect, async (req, res, next) => {
        try {
            // Only allow interviewers to update their sessions
            if (req.user.role !== "interviewer") {
                return res.status(403).json({ message: "Only interviewers can update sessions" });
            }

            const { sessionId } = req.params;
            const { status, ...rest } = await service.UpdateSession(sessionId, req.user.userId, req.body);
            return res.status(status).json({ ...rest });
        } catch (err) {
            next(err);
        }
    });

    // Interviewer deactivates their session
    app.delete("/api/v1/mock-interviews/sessions/:sessionId", protect, async (req, res, next) => {
        try {
            // Only allow interviewers to deactivate their sessions
            if (req.user.role !== "interviewer") {
                return res.status(403).json({ message: "Only interviewers can deactivate sessions" });
            }

            const { sessionId } = req.params;
            const { status, ...rest } = await service.DeactivateSession(sessionId, req.user.userId);
            return res.status(status).json({ ...rest });
        } catch (err) {
            next(err);
        }
    });

    // User gets their bookings (both candidates and interviewers)
    app.get("/api/v1/mock-interviews/bookings/me", protect, async (req, res, next) => {
        try {
            const { status, ...rest } = await service.GetUserBookings(req.user.userId);
            return res.status(status).json({ ...rest });
        } catch (err) {
            next(err);
        }
    });
};

export default mockInterviewAPI;