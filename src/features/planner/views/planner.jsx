import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import './planner.css'
import SideBar from '../../sidebar/views/Layout'
import instagram_img from '../../../images/instagram.png'
const Planner = () => {
  const events = [
    { title: 'Instagram post', start: new Date(), imageUrl: instagram_img }
  ]
  // render event content
  const eventContent = ({ event }) => (
    <div className="custom_event">
      <img src={event.extendedProps.imageUrl} alt={event.title} />
      <h3>{event.title}</h3>
    </div>
  );
  
  // events date
  // const [date,setDate]=useState("")
  // const [data,setdata]=useState([])
  // const datehandler=(e)=>{
  //   setDate(e.target.value)
  //     setdata([...data,date])
  // }
  // const events = data.map(date => ({
  //   title: 'User Event',
  //   start: date,
  //   imageUrl:instagram_img,

  // }));

  return (
    <>
      <section>
        <SideBar />
        <div className='cmn_container'>
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
              <div className='row'>
                <div className='col-lg-4 col-md-6 col-sm-12'>
                  <div className='event_group'>
                    <h2 className='cmn_text_heading'>2</h2>
                    <h5 className='cmn_small_heading'>Scheduled for Today</h5>
                  </div>
                </div>
                <div className='col-lg-4 col-md-6 col-sm-12'>
                  <div className='event_group'>
                    <h2 className='cmn_text_heading'>2</h2>
                    <h5 className='cmn_small_heading'>Posted this Week</h5>
                  </div>
                </div>
                <div className='col-lg-4 col-md-6 col-sm-12'>
                  <div className='event_group' style={{ borderRight: "unset" }}>
                    <h2 className='cmn_text_heading'>2</h2>
                    <h5 className='cmn_small_heading'>Upcoming this Week</h5>
                  </div>
                </div>
              </div>
            </div>
            {/* select option */}
            <div className='calender_outer_wrapper'>
              <div className="custom-header">
                <select className="filter_select_btn filter_options">
                  <option>Filter</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView='dayGridMonth'
                weekends={true}
                events={events}
                eventContent={eventContent}
                // customHeader={customHeader}
                headerToolbar={{
                  left: '  prev',
                  center: 'title',
                  right: 'next,timeGridDay,',
                }}
              >
              </FullCalendar>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
export default Planner