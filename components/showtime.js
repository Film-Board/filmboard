import React from 'react';
import { Tag, Block } from 'rbx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// https://thisinterestsme.com/javascript-get-day-of-week/
const getWeekDay = date => {
  // Create an array containing each day, starting with Sunday.
  const weekdays = new Array(
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  );

  // Use the getDay() method to get the day.
  const day = date.getDay();
  // Return the element that corresponds to that index.
  return weekdays[day];
};

const formatDate = date => {
  return `${getWeekDay(date)}, ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const isFutureDate = date => {
  return date.getTime() > new Date().getTime();
};

export default props => (
  <Block>
    <Tag.Group gapless>
      <Tag size="medium" color={isFutureDate(props.date) ? 'warning' : 'black'}>
        {dayjs(props.date).fromNow()}
      </Tag>
      <Tag size="medium" color="black">
        {dayjs(props.date).format('MM/DD, h:m A')}
      </Tag>
    </Tag.Group>
  </Block>
);
