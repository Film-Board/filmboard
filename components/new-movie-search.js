import React from 'react';
import {Field, Control, Button, Input, Icon} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';

class NewMovieSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      manualTitle: '',
      autoTitle: ''
    };

    this.addManually = this.addManually.bind(this);
    this.addAutomatically = this.addAutomatically.bind(this);
  }

  addManually(e) {
    e.preventDefault();
    this.props.onSubmit({manual: true, title: this.state.manualTitle});
  }

  addAutomatically(e) {
    e.preventDefault();
    this.props.onSubmit({manual: false, title: this.state.autoTitle});
  }

  render() {
    return (
      <div>
        <Field>
          <form onSubmit={this.addManually}>
            <Field kind="addons">
              <Control expanded>
                <Input value={this.state.manualTitle} placeholder="an interesting title..." onChange={e => this.setState({manualTitle: e.target.value})}/>
              </Control>
              <Control>
                <Button color="info">
                  add manually
                </Button>
              </Control>
            </Field>
          </form>
        </Field>

        <Field className="has-text-centered">
          or
        </Field>

        <form onSubmit={this.addAutomatically}>
          <Field kind="addons">
            <Control expanded>
              <Input value={this.state.autoTitle} placeholder="an interesting title..." onChange={e => this.setState({autoTitle: e.target.value})}/>
            </Control>
            <Control>
              <Button color="success">
                <Icon>
                  <FontAwesomeIcon icon={faSearch}/>
                </Icon>
              </Button>
            </Control>
          </Field>
        </form>
      </div>
    );
  }
}

export default NewMovieSearch;
