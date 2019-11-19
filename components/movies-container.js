import React from 'react';
import {Title, Column, Block} from 'rbx';
import Poster from './poster';
import './styles/movies-container.scss';

export default props => (
  <Column.Group centered gapSize={7}>
    {props.movies.map(movie => (
      <Column className="movie-tile" key={movie.id} as="a" desktop={{size: 'one-fifth'}} href={`/movies/${movie.id}`}>
        <Block>
          <Poster key={movie.Poster.id} path={movie.Poster.path}/>
        </Block>
        <Block>
          <Title size="5" className="has-text-centered has-text-weight-medium">{movie.name}</Title>
        </Block>
      </Column>
    ))}
  </Column.Group>
);
