import React from 'react';
import {Container, Title} from 'rbx';
import MoviesContainer from './movies-container';

const MoviesUpcoming = props => (
  <Container>
    <Title size={1}>Upcoming</Title>
    <MoviesContainer movies={props.movies}/>
  </Container>
);

export default MoviesUpcoming;
