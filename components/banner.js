import React from 'react';
import {Column, Container, Section} from 'rbx';
import './styles/banner.scss';

const Banner = props => (
  <Section className={`banner-container ${props.absolutePosition ? 'absolutely-positioned' : ''}`}>
    <Container breakpoint="tablet">
      <Column.Group centered vcentered>
        <Column narrow className="has-text-centered has-text-white has-background-info is-size-7-mobile banner">
          <span>{props.content}</span>
        </Column>
      </Column.Group>
    </Container>
  </Section>
);

export default Banner;
