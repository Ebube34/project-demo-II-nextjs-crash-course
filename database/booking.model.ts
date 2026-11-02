import mongoose, { Schema, type Model, type Types } from "mongoose";
import Event from "./event.model";

export interface Booking {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<Booking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email must be a valid email address."],
    },
  },
  { timestamps: true },
);

bookingSchema.index({ eventId: 1 });

bookingSchema.pre("save", async function () {
  // Confirm the referenced event exists before accepting the booking.
  if (!this.eventId) {
    throw new Error("Booking eventId is required.");
  }

  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error("Cannot create a booking for an event that does not exist.");
  }
});

const BookingModel =
  (mongoose.models.Booking as Model<Booking> | undefined) ??
  mongoose.model<Booking>("Booking", bookingSchema);

export default BookingModel;
