import React from 'react';
import fetch from 'isomorphic-unfetch';
import { Title, Column, Section } from 'rbx';
import NewMovieSearch from '../../components/new-movie-search';
import Suggestions from '../../components/new-movie-suggestions';

class AddMovie extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.movieNameInput = React.createRef();

    this.state = {
      suggestions: []
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

  render() {
    return (
      <div>
        <Section>
          <Column.Group centered>
            <Title className="has-text-centered">Add a movie</Title>
          </Column.Group>

          <Column.Group centered>
            <Column size={4}>
              <form onSubmit={this.handleSubmit}>
                <NewMovieSearch ref={this.movieNameInput} />
              </form>
            </Column>
          </Column.Group>
        </Section>

        <Section>
          <Column.Group centered>
            <Suggestions suggestions={this.state.suggestions}/>
          </Column.Group>
        </Section>
      </div>
    );
  }
}
export default AddMovie;
