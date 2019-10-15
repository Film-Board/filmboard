import React from 'react';
import fetch from 'isomorphic-unfetch';
import { Title, Section, Container } from 'rbx';
import Router from 'next/router';
import PageEditor from '../../../components/page-editor';
import { getBaseURL } from '../../../common/helpers';

class EditPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static async getInitialProps({ query, req }) {
    return (await fetch(`${getBaseURL(req)}/api/pages/${query.name}`)).json();
  }

  async handleSubmit(event, state) {
    event.preventDefault();

    const page = await (await fetch(`/api/pages/${this.props.name}`, {
      method: 'put',
      headers: {
        "Accept": 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(state)
    })).json();

    Router.push(`/pages/${page.name}`);
  }

  render() {
    return (
      <div>
        <Section>
          <Container>
            <Title>Edit Page</Title>
            <PageEditor onSubmit={this.handleSubmit} name={this.props.name} content={this.props.content}/>
          </Container>
        </Section>
      </div>
    );
  }
}
export default EditPage;
