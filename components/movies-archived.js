import React from 'react';
import {Container, Title, Box, Column} from 'rbx';
import fetch from 'isomorphic-unfetch';
import query from 'query-string';
import MoviesContainer from './movies-container';
import MoviesFilter from './movies-filter';

class ArchivedMovies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: props.movies
    };

    this.handleFilter = this.handleFilter.bind(this);
  }

  async handleFilter(event, state) {
    event.preventDefault();

    // Get filtered movies
    if (state.limit === Infinity) {
      delete state.limit;
    }

    const movies = await (await fetch(`/api/movies/search?${query.stringify(state)}`)).json();

    this.setState({movies});
  }

  render() {
    return (
      <Container>
        <Title size={1}>Archived</Title>

        <Column.Group centered>
          <Column size="half">
            <Box>
              <MoviesFilter onSubmit={this.handleFilter}/>
            </Box>
          </Column>
        </Column.Group>
        <MoviesContainer movies={this.state.movies}/>
      </Container>
    );
  }
}

export default ArchivedMovies;
