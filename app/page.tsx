import { Suspense } from 'react';
import { io } from 'next/cache';
import EventsCard from '@/components/EventsCard';
import ExploreBtn from '@/components/ExploreBtn';
import { Event } from '@/database';
import type { Event as EventRecord } from '@/database/event.model';
import connectToDatabase from '@/lib/mongodb';
import { events as sampleEvents } from '@/lib/constants';

type EventSummary = Pick<EventRecord, 'title' | 'image' | 'slug' | 'location' | 'date' | 'time'>;

const page = () => (
  <section>
    <h1 className='text-center'>The Hub For Every Dev <br /> Event You Can&apos;t Miss </h1>
    <p className='text-center mt-5'>hackathons, Meetups and Conferences, All in one place</p>
    <ExploreBtn />

    <div className="mt-20 space-y-7">
      <h3>Featured Events</h3>
      <Suspense fallback={<p>Loading featured events...</p>}>
        <FeaturedEvents />
      </Suspense>
    </div>
  </section>
);

async function FeaturedEvents() {
  await io();

  let events: EventSummary[];
  let usingSampleEvents = false;

  try {
    await connectToDatabase();
    events = await Event.find()
      .sort({ createdAt: -1 })
      .select('title image slug location date time')
      .lean();
  } catch (error) {
    console.error('Failed to load live events; check MongoDB connectivity and Atlas network access:', error);
    events = sampleEvents;
    usingSampleEvents = true;
  }

  return (
    <>
      {usingSampleEvents && (
        <p role="status">
          Showing sample events because live events are currently unavailable.
        </p>
      )}
      <ul id="events" className='events'>
        {events.length > 0 ? (
          events.map((event) => (
            <li className='list-style-type-none' key={event.slug}>
              <EventsCard
                title={event.title}
                image={event.image}
                slug={event.slug}
                location={event.location}
                date={event.date}
                time={event.time}
              />
            </li>
          ))
        ) : (
          <li>No events are available yet.</li>
        )}
      </ul>
    </>
  );
}

export default page;
