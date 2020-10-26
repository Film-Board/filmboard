import React from 'react';
import {Image} from 'rbx';
import './styles/poster.scss';

const Poster = props => (
  <div className="poster-container">
    {props.specialEvent ? (
      <span className="poster-badge">Special Event</span>
    ) : (<div/>)}

    <Image.Container size="2by3">
      <Image className="poster-img" src={'/static/bucket/' + props.path}/>
    </Image.Container>
  </div>
);

export default Poster;
