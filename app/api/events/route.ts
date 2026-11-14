import { Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readText = (body: Record<string, unknown>, name: string) => {
  const value = body[name];
  return typeof value === "string" && value.trim() ? value.trim() : null;
};

const readStringList = (
  body: Record<string, unknown>,
  name: string,
): string[] | null => {
  const value = body[name];
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0,
    )
  ) {
    return null;
  }

  return value.map((item) => item.trim());
};

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "The request body must contain valid JSON." },
      { status: 400 },
    );
  }

  if (!isRecord(body)) {
    return NextResponse.json(
      { message: "The request body must be a JSON object." },
      { status: 400 },
    );
  }

  const title = readText(body, "title");
  const description = readText(body, "description");
  const overview = readText(body, "overview");
  const image = readText(body, "image");
  const venue = readText(body, "venue");
  const location = readText(body, "location");
  const date = readText(body, "date");
  const time = readText(body, "time");
  const mode = readText(body, "mode");
  const audience = readText(body, "audience");
  const organizer = readText(body, "organizer");
  const agenda = readStringList(body, "agenda");
  const tags = readStringList(body, "tags");

  if (
    !title ||
    !description ||
    !overview ||
    !image ||
    !venue ||
    !location ||
    !date ||
    !time ||
    !mode ||
    !audience ||
    !organizer ||
    !agenda?.length ||
    agenda.some((item) => !item) ||
    !tags?.length ||
    tags.some((tag) => !tag)
  ) {
    return NextResponse.json(
      {
        message:
          "All event fields are required. Provide image as a URL or a path under the public folder, and agenda and tags as string arrays.",
      },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();

    const createdEvent = await Event.create({
      title,
      description,
      overview,
      venue,
      location,
      date,
      time,
      mode,
      audience,
      organizer,
      agenda,
      tags,
      image,
    });

    return NextResponse.json(
      { message: "Event created successfully.", event: createdEvent },
      { status: 201 },
    );
  } catch (error) {
    console.error("Event creation failed:", error);

    const isValidationError =
      error instanceof Error &&
      (error.name === "ValidationError" || error.message.startsWith("Event "));
    const isDuplicateSlug =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000;

    return NextResponse.json(
      {
        message: isValidationError
          ? error.message
          : isDuplicateSlug
            ? "An event with this title already exists."
            : "Unable to create the event. Please try again later.",
      },
      { status: isValidationError ? 400 : isDuplicateSlug ? 409 : 500 },
    );
  }
}


export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      {
        message: "Events fetched successfully.",
        events,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      { message: "Unable to fetch events." },
      { status: 500 },
    );
  }
}
