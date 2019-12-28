import React from 'react';
import {Container, Section, Table, Checkbox, Field, Control, Title, Input, Button, Label} from 'rbx';
import {withAuthSync, fetchWithAuth} from '../../components/lib/auth';

class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      newEmail: '',
      saving: false
    };

    this.addUser = this.addUser.bind(this);
    this.editUser = this.editUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  static async getInitialProps(ctx) {
    const users = await fetchWithAuth('/api/users', {}, ctx);

    return {users};
  }

  componentDidMount() {
    this.setState({users: this.props.users});
  }

  async addUser(e) {
    e.preventDefault();

    const {users, newEmail} = this.state;

    const newUser = {email: newEmail, canEditPages: true, canManageUsers: false};

    users.push(newUser);

    this.toggleSaving();

    await fetchWithAuth('/api/users', {method: 'POST', body: newUser});

    this.toggleSaving();
    this.setState({users, newEmail: ''});
  }

  async editUser(user) {
    this.toggleSaving();

    await fetchWithAuth('/api/users', {method: 'PUT', body: user});

    this.toggleSaving();

    // Update state
    this.setState(({users}) => ({
      users: users.map(u => {
        if (u.email === user.email) {
          return user;
        }

        return u;
      })
    }));
  }

  async deleteUser(email) {
    this.toggleSaving();

    await fetchWithAuth('/api/users', {method: 'DELETE', body: {email}});

    this.toggleSaving();

    // Update state
    this.setState(({users}) => ({
      users: users.filter(u => u.email !== email)
    }));
  }

  toggleSaving() {
    this.setState(({saving}) => ({
      saving: !saving
    }));
  }

  render() {
    return (
      <Section>
        <Container>
          <Title size={3}>{this.state.saving ? 'Saving...' : 'Manage Users'}</Title>

          <form onSubmit={this.addUser}>
            <Field horizontal>
              <Field.Label size="normal">
                <Label>Email</Label>
              </Field.Label>
              <Field.Body>
                <Field>
                  <Control>
                    <Input required type="email" placeholder="lcook@mtu.edu" value={this.state.newEmail} onChange={e => this.setState({newEmail: e.target.value})}/>
                  </Control>
                </Field>
                <Field>
                  <Control>
                    <Button color="success">Add User</Button>
                  </Control>
                </Field>
              </Field.Body>
            </Field>
          </form>

          <Table fullwidth>
            <Table.Head>
              <Table.Row>
                <Table.Heading>Email</Table.Heading>
                <Table.Heading>Can Edit Pages/Movies</Table.Heading>
                <Table.Heading>Can Manage Users</Table.Heading>
                <Table.Heading>Remove User</Table.Heading>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {this.state.users.map(user => {
                const disabled = this.props.loggedInUser.email === user.email;

                return (
                  <Table.Row key={user.id}>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell><Checkbox disabled={disabled} defaultChecked={user.canEditPages} onChange={e => this.editUser({email: user.email, canEditPages: e.target.checked})}/></Table.Cell>
                    <Table.Cell><Checkbox disabled={disabled} defaultChecked={user.canManageUsers} onChange={e => this.editUser({email: user.email, canManageUsers: e.target.checked})}/></Table.Cell>
                    <Table.Cell><Button disabled={disabled} color="danger" onClick={() => this.deleteUser(user.email)}>Remove</Button></Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Container>
      </Section>
    );
  }
}

export default withAuthSync(Users);
