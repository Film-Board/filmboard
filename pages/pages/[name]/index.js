import React from 'react';
import fetch from 'isomorphic-unfetch';
import { Container, Content, Section } from 'rbx';
import * as Showdown from "showdown";
import { getBaseURL } from '../../../common/helpers';
import Layout from '../../../components/layout';

class ShowPage extends React.Component {
  static async getInitialProps({ query, req }) {
    const page = await fetch(`${getBaseURL(req)}/api/pages/${query.name}`);

    return page.json();
  }

  render() {
    return (
      <Layout>
        <Section>
          <Container>
            <Content dangerouslySetInnerHTML={{ __html: new Showdown.Converter().makeHtml(this.props.content) }}/>
          </Container>
        </Section>
      </Layout>
    );
  }
}

export default ShowPage;
