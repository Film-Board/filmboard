import React from 'react';
import { Navbar, Icon, Button } from 'rbx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import './styles/navbar.scss';

class Bar extends React.Component {
  render() {
    return (
      <Navbar color="black">
        <Navbar.Brand>
          <Navbar.Item href="#">
            <img src="/static/images/logos/filmboard.png"/>
          </Navbar.Item>
          <Navbar.Burger />
        </Navbar.Brand>
        <Navbar.Menu>
          <Navbar.Segment align="start">
            {this.props.pages.map(page => {
              return (
                <Navbar.Item key={page.id} href={`/pages/${page.name}`}>{page.name}</Navbar.Item>
              );
            })}
          </Navbar.Segment>

          <Navbar.Segment align="end">
            <Navbar.Item as="div">
              <Button.Group>
                <Button as="a" className="is-link is-warning" href="https://www.instagram.com/film_board/" target="_blank">
                  <Icon size="large" color="black" backgroundColor="warning">
                    <FontAwesomeIcon icon={faInstagram} size="lg"/>
                  </Icon>
                </Button>
                <Button as="a" className="is-link is-warning" href="https://twitter.com/filmboard" target="_blank">
                  <Icon size="large" color="black" backgroundColor="warning">
                    <FontAwesomeIcon icon={faTwitter} size="lg"/>
                  </Icon>
                </Button>
                <Button as="a" className="is-link is-warning" href="https://www.facebook.com/filmboard" target="_blank">
                  <Icon size="large" color="warning" backgroundColor="black">
                    <FontAwesomeIcon icon={faFacebookF} size="lg"/>
                  </Icon>
                </Button>
              </Button.Group>
            </Navbar.Item>
          </Navbar.Segment>
        </Navbar.Menu>
      </Navbar>
    );
  }
}

export default Bar;
