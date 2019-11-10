import React from 'react';
import {Tag, Block} from 'rbx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

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
