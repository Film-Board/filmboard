import React from 'react';
import {Title, Section, Container} from 'rbx';
import Router from 'next/router';
import {withAuthSync, fetchWithAuth} from '../../components/lib/auth';
import {getBaseURL} from '../../common/helpers';
import PageEditor from '../../components/page-editor';

class AddPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event, state) {
    event.preventDefault();

    const page = await fetchWithAuth('/api/pages', {
      method: 'post',
      body: state
    });

    Router.push(`/pages/${page.name}`);
  }

  static async getInitialProps(ctx) {
    const categories = await (await fetch(`${getBaseURL(ctx)}/api/pages/categories`)).json();

    return {categories};
  }

  render() {
    return (
      <Section>
        <Container>
          <Title>Add a Page</Title>
          <PageEditor removable={false} categories={this.props.categories} onSubmit={this.handleSubmit}/>
        </Container>
      </Section>
    );
  }
}
export default withAuthSync(AddPage);
