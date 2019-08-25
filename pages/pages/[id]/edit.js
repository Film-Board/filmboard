import React from 'react';
import fetch from 'isomorphic-unfetch';
import { Title, Section } from 'rbx';
import Router from 'next/router';
import Layout from '../../../components/layout';
import PageEditor from '../../../components/page-editor';
import { getBaseURL } from '../../../common/helpers';

class EditPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static async getInitialProps({ query, req }) {
    return (await fetch(`${getBaseURL(req)}/api/pages/${query.id}`)).json();
  }

  async handleSubmit(event, state) {
    event.preventDefault();

    const page = await (await fetch(`/api/pages/${this.props.id}`, {
      method: 'put',
      headers: {
        "Accept": 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(state)
    })).json();

    console.log(page);

    Router.push(`/pages/${page.id}`);
  }

  render() {
    return (
      <Layout>
        <Section>
          <Title>Edit Page</Title>
          <PageEditor onSubmit={this.handleSubmit} name={this.props.name} content={this.props.content}/>
        </Section>
      </Layout>
    );
  }
}
export default EditPage;
