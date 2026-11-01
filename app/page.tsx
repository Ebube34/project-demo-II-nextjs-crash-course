import EventsCard from '@/components/EventsCard';
import ExploreBtn from '@/components/ExploreBtn';
import { events } from '@/lib/constants';


const page = () => {
  return (
    
    <section>

      <h1 className='text-center'>The Hub For Every Dev <br /> Event You Can&apos;t Miss </h1>
      <p className='text-center mt-5'>hackathons, Meetups and Conferences, All in one place</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className='events'>
          {events.map((event) => (
            <li className='list-style-type-none' key={event.title}>
              <EventsCard {...event} />
            </li>
          ))}
        </ul>
      </div>

    </section>
  )
}

export default page;


