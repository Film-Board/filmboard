import React from 'react';
import { Tag, Block } from 'rbx';

export default props => (
  <Block>
    <Tag size="medium" color={props.active ? 'warning' : 'black'}>
      {props.children}
    </Tag>
  </Block>
);
