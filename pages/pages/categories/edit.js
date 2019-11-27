import React from 'react';
import fetch from 'isomorphic-unfetch';
import {Section, Container, Column, Title, Table, Button, Field, Control, Input} from 'rbx';
import {getBaseURL} from '../../../common/helpers';
import {withAuthSync, fetchWithAuth} from '../../../components/lib/auth';

class EditCategories extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: props.categories,
      newCategory: ''
    };

    this.addCategory = this.addCategory.bind(this);
  }

  static async getInitialProps(ctx) {
    const categories = await (await fetch(`${getBaseURL(ctx)}/api/pages/categories`)).json();

    console.log(categories);

    return {categories};
  }

  async deleteCategory(name) {
    await fetchWithAuth('/api/pages/categories',
      {
        method: 'DELETE',
        body: {name}
      });

    this.setState(({categories}) => ({categories: categories.filter(category => category.name !== name)}));
  }

  async addCategory() {
    const newCategory = await fetchWithAuth('/api/pages/categories', {
      method: 'POST',
      body: {name: this.state.newCategory}
    });

    this.setState(({categories}) => ({categories: [...categories, newCategory]}));
  }

  render() {
    return (
      <Section>
        <Container>
          <Column.Group>
            <Column>
              <Title>Page Categories</Title>

              <Field kind="addons">
                <Control>
                  <Input placeholder="Category name" value={this.state.newCategory} onChange={e => this.setState({newCategory: e.target.value})}/>
                </Control>
                <Control>
                  <Button color="info" onClick={this.addCategory}>Add</Button>
                </Control>
              </Field>

              <Table fullwidth>
                <Table.Head>
                  <Table.Row>
                    <Table.Heading>Name</Table.Heading>
                    <Table.Heading>Remove</Table.Heading>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {
                    this.state.categories.map(category => (
                      <Table.Row key={category.id}>
                        <Table.Cell>{category.name}</Table.Cell>
                        <Table.Cell><Button color="danger" onClick={() => this.deleteCategory(category.name)}>Delete</Button></Table.Cell>
                      </Table.Row>
                    ))
                  }
                </Table.Body>
              </Table>

              <p>
                <b>Note</b>: you cannot delete categories that are currently being referenced by at least one page.
              </p>
            </Column>
          </Column.Group>
        </Container>
      </Section>
    );
  }
}

export default withAuthSync(EditCategories);
