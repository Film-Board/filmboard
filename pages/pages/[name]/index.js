import React from 'react';
import fetch from 'isomorphic-unfetch';
import { Container, Content, Section } from 'rbx';
import * as Showdown from "showdown";
import EditButton from '../../../components/edit-button';
import { getBaseURL } from '../../../common/helpers';

class ShowPage extends React.Component {
  static async getInitialProps(ctx) {
    const page = await fetch(`${getBaseURL(ctx)}/api/pages/${ctx.query.name}`);

    return page.json();
  }

  render() {
    return (
      <Section>
        <Container>
          <Content dangerouslySetInnerHTML={{ __html: new Showdown.Converter().makeHtml(this.props.content) }}/>
        </Container>
        <EditButton link={`/pages/${this.props.name}/edit`}/>
      </Section>
    );
  }
}

export default ShowPage;
