import React from 'react';
import {Button, Icon} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit} from '@fortawesome/free-solid-svg-icons';
import {parseToken} from './lib/jwt';
import './styles/edit-button.scss';

class EditButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showButton: false
    };
  }

  componentDidMount() {
    const jwt = parseToken();

    if (jwt) {
      const {user} = jwt;

      this.setState({showButton: user.canEditPages === true});
    }
  }

  render() {
    if (this.state.showButton) {
      return (
        <Button color="warning" className="edit-button" as="a" href={this.props.link}>
          <Icon>
            <FontAwesomeIcon icon={faEdit} color="black"/>
          </Icon>
        </Button>
      );
    }

    return <div/>;
  }
}

export default EditButton;
