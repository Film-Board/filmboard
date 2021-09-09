import React from 'react';

const MovieRatings = props => (
  <div className="ratings is-size-6">
    {
      props.imdb ? (
        <div className="rating">
          <img src="/static/images/logos/imdb.svg"/>
          <span className={`value has-text-${props.color}`}>{props.imdb}</span>
        </div>
      ) : (<div/>)
    }
    {
      props.rottenTomatoes ? (
        <div className={`rating has-text-${props.color}`}>
          <img src="/static/images/logos/rotten-tomatoes.svg"/>
          <span className="value">{props.rottenTomatoes}</span>%
        </div>
      ) : (<div/>)
    }
    {
      props.runtime ? (
        <div className={`runtime has-text-${props.color}`}>
          <span className="hours">{(props.runtime - (props.runtime % 60)) / 60}</span>h
          {' '}
          <span className="minutes">{props.runtime % 60}</span>m
        </div>) : (<div/>)
    }
  </div>
);

export default MovieRatings;
