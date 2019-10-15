import React from 'react';
import { Navbar, Icon, Button } from 'rbx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import './styles/navbar.scss';

export default () => (
  <Navbar color="black">
    <Navbar.Brand>
      <Navbar.Item href="#">
        <img src="/static/images/logos/filmboard.png"/>
      </Navbar.Item>
      <Navbar.Burger />
    </Navbar.Brand>
    <Navbar.Menu>
      <Navbar.Segment align="start">
        <Navbar.Item>Home</Navbar.Item>
        <Navbar.Item>Documentation</Navbar.Item>

        <Navbar.Item dropdown>
          <Navbar.Link>More</Navbar.Link>
          <Navbar.Dropdown>
            <Navbar.Item>About</Navbar.Item>
            <Navbar.Item>Jobs</Navbar.Item>
            <Navbar.Item>Contact</Navbar.Item>
            <Navbar.Divider />
            <Navbar.Item>Report an issue</Navbar.Item>
          </Navbar.Dropdown>
        </Navbar.Item>
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
