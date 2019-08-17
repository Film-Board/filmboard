import React from 'react';
import './styles/movie-ratings.scss';

export default props => (
  <div className="ratings is-size-6">
    <div className="rating">
      <img src="/static/images/logos/imdb.svg"/>
      <span className="value">{props.imdb}</span>
    </div>
    <div className="rating">
      <img src="/static/images/logos/rotten-tomatoes.svg"/>
      <span className="value">{props.rottenTomatoes}</span>%
    </div>
    <div className="runtime">
      <span className="hours">{(props.runtime - (props.runtime % 60)) / 60}</span>h
      <span className="minutes">{props.runtime % 60}</span>m
    </div>
  </div>
);
