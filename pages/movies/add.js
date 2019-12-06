import React from 'react';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import {Title, Column, Section, Container} from 'rbx';
import {withAuthSync, fetchWithAuth} from '../../components/lib/auth';
import NewMovieSearch from '../../components/new-movie-search';
import Suggestions from '../../components/new-movie-suggestions';

class AddMovie extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.addMovie = this.addMovie.bind(this);
    this.movieNameInput = React.createRef();

    this.state = {
      suggestions: [],
      movieAdding: ''
    };
  }

  async handleSubmit(event) {
    event.preventDefault();
    const movieName = this.movieNameInput.current.state.inputValue;

    // Get suggestions
    const suggestions = await (await fetch(`/api/movies/autosuggest/${movieName}`)).json();

    this.setState({
      suggestions
    });
  }

  async addMovie(suggestion) {
    this.setState({movieAdding: suggestion.title});

    const movie = await fetchWithAuth(`/api/movies/add-by-movie-db/${suggestion.id}`, {method: 'POST'});

    this.setState({movieAdding: ''});

    Router.push(`/movies/${movie.id}/edit`);
  }

  render() {
    return (
      <div>
        <Section>
          <Container>
            <Column.Group centered>
              <Title className="has-text-centered">Add a movie</Title>
            </Column.Group>

            <Column.Group centered>
              <Column size={4}>
                <form onSubmit={this.handleSubmit}>
                  <NewMovieSearch ref={this.movieNameInput}/>
                </form>
              </Column>
            </Column.Group>

            <Column.Group centered>
              <Suggestions suggestions={this.state.suggestions} adding={this.state.movieAdding} onAdd={this.addMovie}/>
            </Column.Group>
          </Container>
        </Section>
      </div>
    );
  }
}
export default withAuthSync(AddMovie);
