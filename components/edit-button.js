import React from 'react';
import {Button, Icon} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit} from '@fortawesome/free-solid-svg-icons';
import cookie from 'js-cookie';
import './styles/edit-button.scss';

class EditButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showButton: false
    };
  }

  parseJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  componentDidMount() {
    const token = cookie.get('token');

    if (token) {
      const {user} = this.parseJWT(token);

      this.setState({showButton: user.canEditPages === true});
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
