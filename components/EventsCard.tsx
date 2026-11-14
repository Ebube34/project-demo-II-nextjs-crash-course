import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/database/event.model";
import EventImage from "@/components/EventImage";

type Props = Pick<Event, "title" | "image" | "slug" | "location" | "date" | "time">;

const EventsCard = ({ title, image, slug, location, date, time }: Props) => {
  return (
    <Link href={`/events/${slug}`} className="event-card">
        <EventImage
          image={image}
          alt={title}
          height={300}
          className="poster"
          width={410}
        />

        <div className="flex flex-row gap-2">
          <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
          <p>{location}</p>
        </div>
            
        <p className="title">{title}</p>

        <div className="datetime">
          <div>
             <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
              <p>{date}</p>
          </div>
          <div>
             <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
              <p>{time}</p>
          </div>
        </div>
    </Link>
  )
}

export default EventsCard
