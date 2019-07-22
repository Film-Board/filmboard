import Cleave from 'cleave.js/react';

export default () => (
  <div className="date-time-container">
    <p className="control">
      <Cleave className="input" placeholder="mm/dd/yyyy" options={{date: true}} />
    </p>
    <p className="control">
      <Cleave className="input" placeholder="hh::mm" options={{time: true, timePattern: ['h', 'm']}} />
    </p>
  </div>
);
