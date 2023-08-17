import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import './planner.css'
import SideBar from '../../sidebar/views/Layout'
import instagram_img from'../../../images/instagram.png'
const Planner = () => {
    const events = [
        { title: 'Instagram post', start: new Date() , imageUrl: instagram_img},
    ]
    const eventContent = ({ event }) => (
      <div className="custom_event">
        <img src={event.extendedProps.imageUrl} alt={event.title} />
        <h3>{event.title}</h3>
      </div>
    );
    const customHeaders = (
        <div className="custom-header">
          <h3 className="fc-h3">Custom Header Text</h3>
          <select className="fc-select">
            <option>Filter</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        </div>
      );
    return (
        <>
            <section>
                <SideBar />
                <div className='cmn_container'>
                    <div className='cmn_wrapper_outer'>
                        <div className='planner_outer'>
                            <div className='planner_header_outer'>
                                <div className='planner_header'>
                                    <h2>Planner</h2>
                                    <h6>Here you find all the upcoming Posts you scheduled.</h6>
                                </div>
                                <div>
                                <button className='cmn_btn_color create_post_btn cmn_white_text'>Create Post</button>

                                </div>
                            </div>
                            <div className='events_wrapper'>
                            <div className='event_group'>
                            <div className='Todayevent_outer cmn_event_box'></div>
                            <h5 className=" cmn_white_text">Today Events</h5>
                            </div>
                            <div className='event_group'>
                            <div className='Upcomingevent_outer cmn_event_box'></div>
                            <h5 className=" cmn_white_text">Upcoming Events</h5>
                            </div>
                            <div className='event_group'>
                            <div className='Pastevent_outer cmn_event_box'></div>
                            <h5 className=" cmn_white_text">Past Events</h5>

                            </div>
                            </div>
                            <FullCalendar
                                plugins={[dayGridPlugin]}
                                initialView='dayGridMonth'
                                weekends={true}
                                events={events}
                                eventContent={eventContent}
                                headerToolbar={{
                                    left: ' today prev,next ',
                                    center: 'title',
                                    right: 'timeGridDay,customHeader,customText,customHeaders',
                                  }}
                                //   custom header
                                customButtons={{
                                    customHeader: {
                                      text: 'Upcoming Post',
                                      click: () => {
                                        // Handle custom header button click here
                                        console.log('Custom header button clicked');
                                      },
                                    },
                                    customText:{
                                        text:"Past Events",
                                    }
                                  }}
                                  
                                  headerContent={
                                    customHeaders
                                  }
                                // eventContent={(eventInfo) => (
                                //     <div>
                                //       <strong>{eventInfo.event.title}</strong>
                                //       <p>{eventInfo.timeText}</p>
                                //     </div>
                                //   )}
                            // eventContent={renderEventContent}
                               
                            />
                         
                            
                        </div>
                    </div>
                </div>

            </section>
        </>
    )
}
export default Planner