import React from 'react';
import Link from 'next/link';
import {Title, Column, Block} from 'rbx';
import Poster from './poster';
import './styles/movies-container.scss';

const mobileColumn = {size: 'three-fifths', offset: 'one-fifth'};
const tabletColumn = {size: 'one-quarter'};
const desktopColumn = {size: 'one-fifth'};

export default props => (
  <Column.Group multiline centered tablet={{gapSize: 7}}>
    {props.movies.map(movie => (
      <Link key={movie.id} passHref href={`/movies/${movie.id}`}>
        <Column as="a" className="movie-tile" desktop={desktopColumn} tablet={tabletColumn} mobile={mobileColumn}>
          {movie.Poster ? (
            <Block>
              <Poster key={movie.Poster.id} path={movie.Poster.path}/>
            </Block>
          ) : (<div/>)}
          <Block>
            <Title size="5" className={`has-text-centered default-capitalization has-text-weight-medium ${props.color ? `has-text-${props.color}` : ''}`}>{movie.name}</Title>
          </Block>
        </Column>
      </Link>
    ))}
  </Column.Group>
);
