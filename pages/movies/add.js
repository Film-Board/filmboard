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

    this.state = {
      suggestions: [],
      movieAdding: ''
    };
  }

  async handleSubmit({manual, title}) {
    if (manual) {
      const movie = await fetchWithAuth('/api/movies', {
        method: 'POST',
        body: {
          name: title
        }
      });

      Router.push(`/movies/${movie.id}/edit`);
    } else {
      // Get suggestions
      const suggestions = await (await fetch(`/api/movies/autosuggest/${title}`)).json();

      this.setState({
        suggestions
      });
    }
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
                <NewMovieSearch onSubmit={this.handleSubmit}/>
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
