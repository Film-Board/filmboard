import React from 'react';
import fetch from 'isomorphic-unfetch';
import { Title, Column, Section } from 'rbx';
import Layout from '../../components/layout';
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
      <Layout>
        <Section>
          <Column.Group centered>
            <Title className="has-text-white has-text-centered">Add a movie</Title>
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
      </Layout>
    );
  }
}
export default AddMovie;
