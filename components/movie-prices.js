import React from 'react';
import {Field, Control, Tag} from 'rbx';

export default props => (
  <Field multiline kind="group">
    <Control>
      <Tag.Group gapless>
        <Tag color="warning" className="has-text-weight-bold">${props.ticketPrice}</Tag>
        <Tag color="black">tickets</Tag>
      </Tag.Group>
    </Control>
    <Control>
      <Tag.Group gapless>
        <Tag color="warning" className="has-text-weight-bold">${props.concessionPrice}</Tag>
        <Tag color="black">concessions</Tag>
      </Tag.Group>
    </Control>
  </Field>
);
