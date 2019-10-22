import React from 'react';
import { Button, Icon } from 'rbx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import cookie from 'js-cookie';
import './styles/edit-button.scss';

class EditButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showButton: false
    };
  }

  componentDidMount() {
    if (cookie.get('user')) {
      const user = JSON.parse(cookie.get('user'));

      this.setState({ showButton: user.canEditPages === true });
    }
  }

  render() {
    if (this.state.showButton) {
      return (
        <Button color="warning" className="edit-button" as="a" href={this.props.link}>
          <Icon>
            <FontAwesomeIcon icon={faEdit}/>
          </Icon>
        </Button>
      );
    }

    return <div/>;
  }
}

export default EditButton;
