import Cleave from 'cleave.js/react';

export default (props) => (
  <div className="date-time-container">
    <p className="control">
      <Cleave className="input" name={props.name + '-date'} placeholder="mm/dd/yyyy" options={{date: true, datePattern: ['m', 'd', 'Y']}} value={props['data-date']}/>
    </p>
    <p className="control">
      <Cleave className="input" placeholder="hh::mm" name={props.name + '-time'} options={{time: true, timePattern: ['h', 'm']}} value={props['data-time']}/>
    </p>
  </div>
);
