import React from "react";
import ExternalEvents from "../components/externalevents/ExternalEvents";

const ExtEvents = () => {
  return (
    <div>
        <ExternalEvents />
    </div>
    );
};

export default ExtEvents;

// export const EventSearch = () => {
//   return (
//     <div className="search-container">
//       <div className="search-inner">
//         <div className="search-content">
//           <div className="search-left">
//             <div className="grow">
//               <div className="gap-5 flex">
//                 <div className="w-[85%]">
//                   <div className="flex w-full flex-col">
//                     <h1 className="search-title">Upcoming Events</h1>
//                     <div className="search-box-container">
//                       <div className="search-input-wrapper">
//                         <input
//                           type="text"
//                           placeholder="Search"
//                           className="search-input"
//                         />
//                         <img
//                           loading="lazy"
//                           src="https://cdn.builder.io/api/v1/image/assets/863c0a5f9ca34694b1e7194a73712b2f/ceee35d297d4c0fe5453107e73e7fbb494e6164c747eb1afdb410a1be3052fd4?placeholderIfAbsent=true"
//                           className="search-icon"
//                           alt="Search"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="w-[15%] ml-5">
//                   <div className="flex w-full flex-col items-stretch">
//                     <button className="filter-button">Filter</button>
//                     <img
//                       loading="lazy"
//                       src="https://cdn.builder.io/api/v1/image/assets/863c0a5f9ca34694b1e7194a73712b2f/1db6b3c6831e76edacbb6316f2600f39b6ad6f988bc1993b6dd74af870f09e4e?placeholderIfAbsent=true"
//                       className="filter-icon"
//                       alt="Filter icon"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="w-[19%] ml-5">
//             <div className="flex w-full items-stretch">
//               <button className="calendar-button">Event Calendar</button>
//               <img
//                 loading="lazy"
//                 src="https://cdn.builder.io/api/v1/image/assets/863c0a5f9ca34694b1e7194a73712b2f/bee259402dbe33f1f098f41d576457da3d50fcf134930e5e2b32c8b0c97b6f97?placeholderIfAbsent=true"
//                 className="calendar-icon"
//                 alt="Calendar"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ExternalEvents;

// import React from 'react';
// import './ExternalEvents.css'
// const ExternalEvents = () => {
//   const events = [
//     {
//       title: "Student Rep Social",
//       description: "Join our Student Rep Social Event to connect, share ideas, and collaborate on making student life better. A great chance to meet reps and engage in meaningful discussions!",
//       location: "Second floor quiet room",
//       time: "15:30 17:00",
//       imageUrl: "/placeholder-event-1.jpg",
//       alternating: true
//     },
//     {
//       title: "UoBDMUN'25 Conference",
//       description: "A dynamic conference where delegates engage in impactful debates, tackle global issues, and refine their diplomacy skills. Join us for an unforgettable MUN experience!",
//       location: "Main auditorium",
//       time: "12:00 14:00",
//       imageUrl: "/placeholder-event-2.jpg"
//     },
//     // Add more events as needed
//   ];

//   return (
//     <div className="bg-white">
//       {/* Search Section */}
//       <div className="search-container">
//         <div className="search-inner">
//           <div className="search-content">
//             <div className="search-left">
//               <h1 className="search-title">Upcoming Events</h1>
//               <div className="search-box-container">
//                 <div className="search-input-wrapper">
//                   <input type="text" placeholder="Search" className="search-input" />
//                   <img src="/search-icon.svg" className="search-icon" alt="Search" />
//                 </div>
//                 <button className="filter-button">Filter</button>
//               </div>
//             </div>
//             <button className="calendar-button">
//               Event Calendar
//               <img src="/calendar-icon.svg" className="calendar-icon" alt="Calendar" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Events List */}
//       <section className="events-section">
//         {events.map((event, index) => (
//           <div key={index} className={`event-card ${event.alternating ? 'alternating' : ''}`}>
//             <img src={event.imageUrl} className="event-image" alt={event.title} />
//             <div className="event-content">
//               <h2 className="event-title">{event.title}</h2>
//               <p className="event-description">{event.description}</p>
//             </div>
//             <div className="event-actions">
//               <div className="actions-container">
//                 <button className="action-button">Follow</button>
//                 <button className="action-button">Details</button>
//                 <img src="/share-icon.svg" className="share-icon" alt="Share" />
//               </div>
//               <div className="event-meta">
//                 {event.location} Time: {event.time}
//               </div>
//             </div>
//           </div>
//         ))}
//       </section>
//     </div>
//   );
// };

// export default ExternalEvents;