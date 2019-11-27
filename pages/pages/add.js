import React from 'react';
import {Title, Section} from 'rbx';
import Router from 'next/router';
import {withAuthSync, fetchWithAuth} from '../../components/lib/auth';
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

  render() {
    return (
      <Section>
        <Title>Add a Page</Title>
        <PageEditor removable={false} onSubmit={this.handleSubmit}/>
      </Section>
    );
  }
}
export default withAuthSync(AddPage);
