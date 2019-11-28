import React from 'react';
import Link from 'next/link';
import {Title, Column, Block} from 'rbx';
import Poster from './poster';
import './styles/movies-container.scss';

export default props => (
  <Column.Group centered gapSize={7}>
    {props.movies.map(movie => (
      <Link key={movie.id} passHref href={`/movies/${movie.id}`}>
        <Column as="a" className="movie-tile" desktop={{size: 'one-fifth'}}>
          {movie.Poster ? (
            <Block>
              <Poster key={movie.Poster.id} path={movie.Poster.path}/>
            </Block>
          ) : (<div/>)}
          <Block>
            <Title size="5" className="has-text-centered has-text-weight-medium">{movie.name}</Title>
          </Block>
        </Column>
      </Link>
    ))}
  </Column.Group>
);
