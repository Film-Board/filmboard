import React from 'react';
import {Title, Tag, Block} from 'rbx';
import dayjs from 'dayjs';
import {groupShowtimesByDay, getWeekDay, getNow} from './lib/dates';

const now = getNow();

const isFutureDate = date => {
  return date.getTime() > now;
};

const Day = props => (
  <div>
    <Title size={4} color="white">{`${getWeekDay(props.group.day)}, ${props.showYear ? dayjs(props.group.day).format('MM/DD/YY') : dayjs(props.group.day).format('MM/DD')}`}</Title>

    <Tag.Group>
      {
        props.group.times.map(time => (
          <Tag key={time.id} className={isFutureDate(time.time) ? 'has-text-weight-bold' : ''} color={isFutureDate(time.time) ? 'warning' : 'black'}>{dayjs(time.time).format('h:mm A')}
          </Tag>
        ))
      }
    </Tag.Group>
  </div>
);

export default props => {
  let stillShowing = false;

  props.showtimes.forEach(showtime => {
    if (new Date(showtime.time) > now) {
      stillShowing = true;
    }
  });

  return groupShowtimesByDay(props.showtimes).map(d => (
    <Block key={d.day}>
      <Day group={d} showYear={!stillShowing}/>
    </Block>
  ));
};
