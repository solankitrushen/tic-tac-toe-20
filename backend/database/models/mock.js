import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const mockInterviewSessionSchema = new mongoose.Schema(
    {
        interviewerId: {
            type: String,
            required: true,
        },
        sessionId: {
            type: String,
            required: true,
            unique: true,
            default: uuid,
        },
        interviewType: {
            type: String,
            required: true,
            enum: ["technical", "hr", "fullstack", "frontend", "backend", "system-design"]
        },
        interviewTopic: {
            type: String,
            required: true,
        },
        availableDates: {
            type: [Date],
            required: true,
        },
        duration: {
            type: Number,
            required: true,
            min: 30, // minimum 30 minutes
            max: 120, // maximum 2 hours
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: "USD",
        },
        timeSlots: {
            type: [String], // e.g. ["09:00", "10:30", "14:00"]
            required: true,
        },
        timezone: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        interviewerInfo: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            bio: { type: String },
            company: { type: String },
            position: { type: String },
            expertise: { type: [String] },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        maxInterviews: {
            type: Number,
            default: 10,
        },
        bookedSlots: {
            type: [{
                date: Date,
                time: String,
                userId: String,
                status: {
                    type: String,
                    enum: ["booked", "completed", "cancelled"],
                    default: "booked"
                }
            }],
            default: []
        }
    },
    { timestamps: true }
);

const MockInterviewSession = mongoose.model("MockInterviewSession", mockInterviewSessionSchema);

export default MockInterviewSession;