import MockInterviewSession from "../models/mock-interview-model.js";
import { APIError, STATUS_CODES } from "../../utils/app-errors.js";

export default class MockInterviewRepository {
    async createSession(sessionData) {
        try {
            const session = await MockInterviewSession.create(sessionData);
            return session;
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to create mock interview session"
            );
        }
    }

    async findSessionById(sessionId) {
        try {
            const session = await MockInterviewSession.findOne({ sessionId });
            if (!session) {
                return { message: "Session not found", status: 404 };
            }
            return { session };
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to find mock interview session"
            );
        }
    }

    async findSessionsByInterviewer(interviewerId) {
        try {
            const sessions = await MockInterviewSession.find({ interviewerId, isActive: true });
            if (!sessions || sessions.length === 0) {
                return { message: "No sessions found for this interviewer", status: 404 };
            }
            return { sessions };
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to find mock interview sessions"
            );
        }
    }

    async findAllAvailableSessions() {
        try {
            const sessions = await MockInterviewSession.find({
                isActive: true,
                $expr: { $lt: [{ $size: "$bookedSlots" }, "$maxInterviews"] }
            });
            if (!sessions || sessions.length === 0) {
                return { message: "No available sessions found", status: 404 };
            }
            return { sessions };
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to find available mock interview sessions"
            );
        }
    }

    async bookSession(sessionId, userId, bookingData) {
        try {
            const { date, time } = bookingData;

            // Check if slot is available
            const session = await MockInterviewSession.findOne({
                sessionId,
                isActive: true,
                "bookedSlots": {
                    $not: {
                        $elemMatch: {
                            date: new Date(date),
                            time,
                            status: { $in: ["booked", "completed"] }
                        }
                    }
                }
            });

            if (!session) {
                return { message: "Slot not available or session not found", status: 400 };
            }

            // Add the booking
            const updatedSession = await MockInterviewSession.findOneAndUpdate(
                { sessionId },
                {
                    $push: {
                        bookedSlots: {
                            date: new Date(date),
                            time,
                            userId,
                            status: "booked"
                        }
                    }
                },
                { new: true }
            );

            return { session: updatedSession };
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to book mock interview session"
            );
        }
    }

    async cancelBooking(sessionId, userId, bookingData) {
        try {
            const { date, time } = bookingData;

            const updatedSession = await MockInterviewSession.findOneAndUpdate(
                {
                    sessionId,
                    "bookedSlots": {
                        $elemMatch: {
                            date: new Date(date),
                            time,
                            userId,
                            status: "booked"
                        }
                    }
                },
                {
                    $set: { "bookedSlots.$.status": "cancelled" }
                },
                { new: true }
            );

            if (!updatedSession) {
                return { message: "Booking not found or already cancelled", status: 400 };
            }

            return { session: updatedSession };
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to cancel mock interview booking"
            );
        }
    }

    async updateSession(sessionId, interviewerId, updateData) {
        try {
            const session = await MockInterviewSession.findOneAndUpdate(
                { sessionId, interviewerId },
                updateData,
                { new: true }
            );

            if (!session) {
                return { message: "Session not found or not authorized", status: 404 };
            }

            return { session };
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to update mock interview session"
            );
        }
    }

    async deactivateSession(sessionId, interviewerId) {
        try {
            const session = await MockInterviewSession.findOneAndUpdate(
                { sessionId, interviewerId },
                { isActive: false },
                { new: true }
            );

            if (!session) {
                return { message: "Session not found or not authorized", status: 404 };
            }

            return { session };
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to deactivate mock interview session"
            );
        }
    }

    async getUserBookings(userId) {
        try {
            const sessions = await MockInterviewSession.find({
                "bookedSlots": {
                    $elemMatch: {
                        userId,
                        status: { $in: ["booked", "completed"] }
                    }
                }
            });

            if (!sessions || sessions.length === 0) {
                return { message: "No bookings found for this user", status: 404 };
            }

            return { sessions };
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to get user bookings"
            );
        }
    }
}