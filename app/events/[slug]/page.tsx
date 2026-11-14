import Image from "next/image";
import { io } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import EventModel, { type Event as EventData } from "@/database/event.model";
import connectToDatabase from "@/lib/mongodb";
import BookEvent from "@/components/BookEvent";
import { getSimilarEventsBySlug } from "@/lib/actions/events.actions";
import EventsCard from "@/components/EventsCard";
import EventImage from "@/components/EventImage";

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventsTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag, index) => (
      <div className="pill" key={`${tag}-${index}`}>
        {tag}
      </div>
    ))}
  </div>
);

function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  if (value.length === 1 && typeof value[0] === "string") {
    try {
      const parsed: unknown = JSON.parse(value[0]);
      if (
        Array.isArray(parsed) &&
        parsed.every((item): item is string => typeof item === "string")
      ) {
        return parsed;
      }
    } catch {
      // Older records may store a plain string instead of a JSON-encoded list.
    }
  }

  return value.filter((item): item is string => typeof item === "string");
}

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

export default function EventsDetailsPage({ params }: EventPageProps) {
  return (
    <Suspense fallback={<p role="status">Loading event...</p>}>
      <EventDetails params={params} />
    </Suspense>
  );
}

async function EventDetails({ params }: EventPageProps) {
  await io();
  const { slug } = await params;

  let event: EventData | null;
  try {
    await connectToDatabase();
    event = await EventModel.findOne({ slug }).lean<EventData | null>();
  } catch (error) {
    console.error(
      "Failed to load event; check MongoDB connectivity and Atlas network access:",
      error,
    );
    return (
      <section id="event">
        <h1>Event data is currently unavailable</h1>
        <p>Check your MongoDB connection and try again.</p>
      </section>
    );
  }

  if (!event?.description || !event.image) {
    notFound();
  }

  const bookings = 10;

  const similarEvents = (await getSimilarEventsBySlug(slug)) as EventData[];


  const {
    description,
    image,
    overview,
    mode,
    date,
    time,
    location,
    agenda,
    audience,
    tags,
    organizer,
  } = event;

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>
      <div className="details">
        <div className="content">
          <EventImage
            image={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Events Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem
              icon="/icons/pin.svg"
              alt="location"
              label={location}
            />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>

          <EventAgenda agendaItems={toStringList(agenda)} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventsTags tags={toStringList(tags)} />
        </div>

        <aside className="booking">
         <div className="signup-card">
          <h2>Book Your Spot</h2>
          {bookings > 0 ? (
            <p className="text-sm">
              Join {bookings} people who have already booked their spot!
            </p>
          ): (
            <p className="text-sm">Be the first to book your spot!</p>
          )}

          <BookEvent />
         </div>
        </aside>
      </div>


      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div>
          {similarEvents.length > 0 &&
            similarEvents.map((similarEvent: EventData) => (
              <EventsCard key={similarEvent.slug} {...similarEvent} />
            ))}
        </div>
      </div>
    </section>
  );
}
