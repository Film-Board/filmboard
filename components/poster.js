import React from 'react';
import { Image } from 'rbx';
import './styles/poster.scss';

export default props => (
  <Image.Container size="2by3" className="poster-container">
    <Image className="img-poster" src={'/static/images/posters/' + props.filename}/>
  </Image.Container>
);
