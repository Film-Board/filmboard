import React from 'react';
import { Field, Control, Button, Input, Icon } from 'rbx';
import './styles/new-movie-search.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

class NewMovieSearch extends React.Component {
  constructor() {
    super();

    this.state = {
      inputValue: ''
    };
  }

  updateInputValue(event) {
    this.setState({
      inputValue: event.target.value
    });
  }

  render() {
    return (
      <Field kind="addons">
        <Control expanded>
          <Input value={this.state.inputValue} onChange={event => this.updateInputValue(event)} placeholder="Start typing a movie's name to add it..."/>
        </Control>
        <Control>
          <Button color="success">
            <Icon>
              <FontAwesomeIcon icon={faSearch}/>
            </Icon>
          </Button>
        </Control>
      </Field>
    );
  }
}

export default NewMovieSearch;
