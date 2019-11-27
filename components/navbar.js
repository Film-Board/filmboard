import React from 'react';
import Link from 'next/link';
import {Navbar, Icon, Button, Image} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faInstagram, faTwitter, faFacebookF} from '@fortawesome/free-brands-svg-icons';
import './styles/navbar.scss';

class Bar extends React.Component {
  render() {
    return (
      <Navbar color="black">
        <Navbar.Brand>
          <Link href="/">
            <Navbar.Item>
              <img src="/static/images/logos/filmboard.png"/>
            </Navbar.Item>
          </Link>
          <Navbar.Burger/>
        </Navbar.Brand>
        <Navbar.Menu>
          <Navbar.Segment align="start">
            {this.props.pages.map(page => {
              const link = page.href ? page.href : `/pages/${page.name}`;

              return (
                <Link key={page.name} href={link}><Navbar.Item>{page.name}</Navbar.Item></Link>
              );
            })}

            {Object.keys(this.props.folders).map(category => (
              <Navbar.Item key={category} dropdown>
                <Navbar.Link>{category}</Navbar.Link>
                <Navbar.Dropdown>
                  {
                    this.props.folders[category].map(page => (
                      <Link key={page.id} href={`/pages/${page.name}`}><Navbar.Item>{page.name}</Navbar.Item></Link>
                    ))
                  }
                </Navbar.Dropdown>
              </Navbar.Item>
            ))}
          </Navbar.Segment>

          <Navbar.Segment align="end">
            {
              this.props.loggedInUser ? (
                <Navbar.Item dropdown>
                  <Navbar.Link>
                    <Image.Container size={24}>
                      <Image rounded src={this.props.loggedInUser.picture}/>
                    </Image.Container>
                  </Navbar.Link>

                  <Navbar.Dropdown>
                    {
                      this.props.loggedInUser.canEditPages ? (
                        <div>
                          <Link href="/pages/add"><Navbar.Item>Add a Page</Navbar.Item></Link>
                          <Link href="/movies/add"><Navbar.Item>Add a Movie</Navbar.Item></Link>
                        </div>
                      ) : (<div/>)
                    }
                    {
                      this.props.loggedInUser.canManageUsers ? (
                        <Link href="/users"><Navbar.Item>Manage Users</Navbar.Item></Link>
                      ) : (<div/>)
                    }

                    <Navbar.Divider/>
                    <Link href="/logout"><Navbar.Item>Logout</Navbar.Item></Link>
                  </Navbar.Dropdown>
                </Navbar.Item>
              ) : (
                <div/>
              )
            }
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
