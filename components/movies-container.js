import React from 'react';
import {Title, Column, Block} from 'rbx';
import Poster from './poster';

export default props => (
  <Column.Group centered gapSize={7}>
    {props.movies.map(movie => (
      <Column key={movie.id} as="a" desktop={{size: 'one-fifth'}} href={`/movies/${movie.id}`}>
        <Block>
          <Poster key={movie.poster} filename={movie.poster}/>
        </Block>
        <Block>
          <Title size="5" className="has-text-centered has-text-weight-medium">{movie.name}</Title>
        </Block>
      </Column>
    ))}
  </Column.Group>
);
