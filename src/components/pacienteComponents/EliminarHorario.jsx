import React from 'react';

const CustomEvent = ({ event, handleEliminarHorario }) => {

  return (

    <div className="custom-event">
      <div  className="event-title">{event.title}</div>
      {event.isHorario && (
        <div >
       <button
  onClick={() => handleEliminarHorario(event.id)}
>
  🗑️
</button>
        </div>
      )}

    </div>
  );
};

export default CustomEvent;