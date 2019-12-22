import React from 'react';
import {Title, Tag, Block} from 'rbx';
import dayjs from 'dayjs';
import {groupShowtimesByDay, getWeekDay} from './lib/dates';

const isFutureDate = date => {
  return date.getTime() > new Date().getTime();
};

const Day = props => (
  <div>
    <Title size={4}>{`${getWeekDay(props.group.day)}, ${dayjs(props.group.day).format('MM/DD')}`}</Title>

    <Tag.Group>
      {
        props.group.times.map(time => (
          <Tag key={time.id} color={isFutureDate(time.time) ? 'warning' : 'black'} size="medium">{dayjs(time.time).format('h:mm A')}
          </Tag>
        ))
      }
    </Tag.Group>
  </div>
);

export default props => groupShowtimesByDay(props.showtimes).map(d => (
  <Block key={d.day}>
    <Day group={d}/>
  </Block>
));
