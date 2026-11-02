import mongoose, { Schema, type Model } from "mongoose";

export interface Event {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const requiredText = {
  required: true,
  trim: true,
  validate: {
    validator: (value: string) => value.trim().length > 0,
    message: "This field cannot be empty.",
  },
};

const eventSchema = new Schema<Event>(
  {
    title: requiredText,
    slug: { type: String, unique: true, trim: true },
    description: requiredText,
    overview: requiredText,
    image: requiredText,
    venue: requiredText,
    location: requiredText,
    date: requiredText,
    time: requiredText,
    mode: requiredText,
    audience: requiredText,
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) =>
          value.length > 0 && value.every((item) => item.trim().length > 0),
        message: "Agenda must contain at least one non-empty item.",
      },
    },
    organizer: requiredText,
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) =>
          value.length > 0 && value.every((item) => item.trim().length > 0),
        message: "Tags must contain at least one non-empty item.",
      },
    },
  },
  { timestamps: true },
);

function createSlug(title: string): string {
  // Normalize accents and punctuation so the title produces a URL-friendly slug.
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeDate(value: string): string {
  // Reject invalid calendar dates instead of allowing JavaScript to roll them over.
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) {
    const parsedDate = new Date(`${value}T00:00:00.000Z`);
    if (!Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value) {
      return value;
    }
    throw new Error("Event date must be a valid date.");
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Event date must be a valid date.");
  }

  return parsedDate.toISOString().slice(0, 10);
}

function normalizeTime(value: string): string {
  const twelveHourTime = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i.exec(value);
  const twentyFourHourTime = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(value);
  const match = twelveHourTime ?? twentyFourHourTime;

  if (!match) {
    throw new Error("Event time must be a valid 12-hour or 24-hour time.");
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] ?? 0);

  if (twelveHourTime) {
    if (hours < 1 || hours > 12) {
      throw new Error("Event time must be a valid 12-hour or 24-hour time.");
    }
    hours = (hours % 12) + (twelveHourTime[4].toUpperCase() === "PM" ? 12 : 0);
  } else if (hours > 23) {
    throw new Error("Event time must be a valid 12-hour or 24-hour time.");
  }

  if (minutes > 59 || seconds > 59) {
    throw new Error("Event time must be a valid 12-hour or 24-hour time.");
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

eventSchema.pre("save", function () {
  const requiredFields: (keyof Event)[] = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ];

  // Check again in the hook so malformed values cannot be saved through hook workflows.
  for (const field of requiredFields) {
    if (typeof this[field] !== "string" || this[field].trim().length === 0) {
      throw new Error(`Event ${field} is required.`);
    }
  }

  if (this.isModified("title")) {
    const slug = createSlug(this.title);
    if (!slug) {
      throw new Error("Event title must contain characters that can be used in a slug.");
    }
    this.slug = slug;
  }
  if (typeof this.slug !== "string" || this.slug.trim().length === 0) {
    throw new Error("Event slug is required.");
  }

  // Persist dates as YYYY-MM-DD and times as 24-hour HH:mm:ss.
  this.date = normalizeDate(this.date);
  this.time = normalizeTime(this.time);
});

const EventModel =
  (mongoose.models.Event as Model<Event> | undefined) ??
  mongoose.model<Event>("Event", eventSchema);

export default EventModel;
