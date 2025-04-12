import MockInterviewRepository from "../database/repository/mock-interview-repository.js";
import { APIError, STATUS_CODES } from "../utils/app-errors.js";
import sendEmail from "../mails/mail.js";

export default class MockInterviewService {
    constructor() {
        this.repository = new MockInterviewRepository();
    }

    async CreateSession(interviewerId, body) {
        try {
            // Validate required fields
            const { interviewType, interviewTopic, availableDates, duration, price, timeSlots, timezone, description, interviewerInfo } = body;

            if (!interviewType || !interviewTopic || !availableDates || !duration || !price || !timeSlots || !timezone || !description || !interviewerInfo) {
                return {
                    message: "Please provide all required fields for creating a session.",
                    status: STATUS_CODES.BAD_REQUEST
                };
            }

            // Add interviewerId to the body
            body.interviewerId = interviewerId;

            // Create session
            const session = await this.repository.createSession(body);

            return {
                message: "Mock Interview session created successfully!",
                sessionId: session.sessionId,
                status: STATUS_CODES.CREATED
            };
        } catch (err) {
            throw new APIError(
                "An error occurred while creating the mock interview session.",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async GetInterviewerSessions(interviewerId) {
        try {
            const { status, sessions, message } = await this.repository.findSessionsByInterviewer(interviewerId);

            if (status === STATUS_CODES.NOT_FOUND) {
                return { message, status };
            }

            return {
                message: "Interviewer sessions retrieved successfully",
                sessions,
                status: STATUS_CODES.OK
            };
        } catch (err) {
            throw new APIError(
                "An error occurred while retrieving interviewer sessions",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async GetAllAvailableSessions() {
        try {
            const { status, sessions, message } = await this.repository.findAllAvailableSessions();

            if (status === STATUS_CODES.NOT_FOUND) {
                return { message, status };
            }

            // Filter out booked slots from the response
            const availableSessions = sessions.map(session => {
                const { bookedSlots, ...sessionData } = session.toObject();

                // Filter available dates that still have slots
                const availableDatesWithSlots = session.availableDates.filter(date => {
                    const dateStr = date.toISOString().split('T')[0];
                    return session.timeSlots.some(time => {
                        return !session.bookedSlots.some(booked =>
                            booked.date.toISOString().split('T')[0] === dateStr &&
                            booked.time === time &&
                            booked.status === "booked"
                        );
                    });
                });

                return {
                    ...sessionData,
                    availableDates: availableDatesWithSlots,
                    availableSlots: session.timeSlots
                };
            });

            return {
                message: "Available sessions retrieved successfully",
                sessions: availableSessions,
                status: STATUS_CODES.OK
            };
        } catch (err) {
            throw new APIError(
                "An error occurred while retrieving available sessions",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async BookSession(sessionId, userId, bookingData) {
        try {
            const { date, time } = bookingData;

            if (!date || !time) {
                return {
                    message: "Please provide date and time for booking",
                    status: STATUS_CODES.BAD_REQUEST
                };
            }

            // Book the session
            const { status, session, message } = await this.repository.bookSession(sessionId, userId, bookingData);

            if (status) {
                return { message, status };
            }

            // Send confirmation emails
            try {
                // Email to candidate
                await sendEmail(
                    userId.email, // Assuming userId has email, adjust as per your user model
                    "Mock Interview Session Booked",
                    "interviewBookedMail",
                    {
                        InterviewType: session.interviewType,
                        Topic: session.interviewTopic,
                        Date: new Date(date).toLocaleDateString(),
                        Time: time,
                        Duration: `${session.duration} minutes`,
                        InterviewerName: session.interviewerInfo.name
                    }
                );

                // Email to interviewer
                await sendEmail(
                    session.interviewerInfo.email,
                    "New Mock Interview Booking",
                    "interviewerBookingNotificationMail",
                    {
                        InterviewerName: session.interviewerInfo.name,
                        CandidateEmail: userId.email,
                        Type: session.interviewType,
                        Topic: session.interviewTopic,
                        Date: new Date(date).toLocaleDateString(),
                        Time: time,
                        Duration: `${session.duration} minutes`
                    }
                );
            } catch (emailErr) {
                console.error("Failed to send emails:", emailErr);
            }

            return {
                message: "Session booked successfully!",
                bookingDetails: {
                    sessionId: session.sessionId,
                    date,
                    time,
                    interviewer: session.interviewerInfo.name
                },
                status: STATUS_CODES.OK
            };
        } catch (err) {
            throw new APIError(
                "An error occurred while booking the session",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async CancelBooking(sessionId, userId, bookingData) {
        try {
            const { date, time } = bookingData;

            if (!date || !time) {
                return {
                    message: "Please provide date and time for cancellation",
                    status: STATUS_CODES.BAD_REQUEST
                };
            }

            // Cancel the booking
            const { status, session, message } = await this.repository.cancelBooking(sessionId, userId, bookingData);

            if (status) {
                return { message, status };
            }

            // Send cancellation emails
            try {
                // Email to candidate
                await sendEmail(
                    userId.email,
                    "Mock Interview Booking Cancelled",
                    "interviewCancelledMail",
                    {
                        InterviewType: session.interviewType,
                        Topic: session.interviewTopic,
                        Date: new Date(date).toLocaleDateString(),
                        Time: time,
                        InterviewerName: session.interviewerInfo.name
                    }
                );

                // Email to interviewer
                await sendEmail(
                    session.interviewerInfo.email,
                    "Mock Interview Booking Cancelled",
                    "interviewerCancellationNotificationMail",
                    {
                        InterviewerName: session.interviewerInfo.name,
                        CandidateEmail: userId.email,
                        Type: session.interviewType,
                        Topic: session.interviewTopic,
                        Date: new Date(date).toLocaleDateString(),
                        Time: time
                    }
                );
            } catch (emailErr) {
                console.error("Failed to send emails:", emailErr);
            }

            return {
                message: "Booking cancelled successfully!",
                status: STATUS_CODES.OK
            };
        } catch (err) {
            throw new APIError(
                "An error occurred while cancelling the booking",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async UpdateSession(sessionId, interviewerId, updateData) {
        try {
            // Validate that we're not trying to update booked slots directly
            if (updateData.bookedSlots) {
                return {
                    message: "Cannot update booked slots directly",
                    status: STATUS_CODES.BAD_REQUEST
                };
            }

            const { status, session, message } = await this.repository.updateSession(sessionId, interviewerId, updateData);

            if (status === STATUS_CODES.NOT_FOUND) {
                return { message, status };
            }

            return {
                message: "Session updated successfully",
                session,
                status: STATUS_CODES.OK
            };
        } catch (err) {
            throw new APIError(
                "An error occurred while updating the session",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async DeactivateSession(sessionId, interviewerId) {
        try {
            const { status, session, message } = await this.repository.deactivateSession(sessionId, interviewerId);

            if (status === STATUS_CODES.NOT_FOUND) {
                return { message, status };
            }

            return {
                message: "Session deactivated successfully",
                session,
                status: STATUS_CODES.OK
            };
        } catch (err) {
            throw new APIError(
                "An error occurred while deactivating the session",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async GetUserBookings(userId) {
        try {
            const { status, sessions, message } = await this.repository.getUserBookings(userId);

            if (status === STATUS_CODES.NOT_FOUND) {
                return { message, status };
            }

            // Extract only the user's bookings from each session
            const userBookings = sessions.flatMap(session => {
                return session.bookedSlots
                    .filter(slot => slot.userId === userId && slot.status !== "cancelled")
                    .map(slot => ({
                        sessionId: session.sessionId,
                        interviewType: session.interviewType,
                        interviewTopic: session.interviewTopic,
                        interviewerInfo: session.interviewerInfo,
                        date: slot.date,
                        time: slot.time,
                        status: slot.status,
                        duration: session.duration,
                        price: session.price,
                        currency: session.currency
                    }));
            });

            return {
                message: "User bookings retrieved successfully",
                bookings: userBookings,
                status: STATUS_CODES.OK
            };
        } catch (err) {
            throw new APIError(
                "An error occurred while retrieving user bookings",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }
}