import React from 'react';
import fetch from 'isomorphic-unfetch';
import {Container, Content, Section, Column} from 'rbx';
import * as Showdown from 'showdown';
import EditButton from '../../../components/edit-button';
import {getBaseURL} from '../../../common/helpers';

class ShowPage extends React.Component {
  static async getInitialProps(ctx) {
    const page = await fetch(`${getBaseURL(ctx)}/api/pages/${ctx.query.name}`);

    return page.json();
  }

  render() {
    return (
      <Section>
        <Container>
          <Column.Group centered>
            <Column size={6}>
              <Content dangerouslySetInnerHTML={{__html: new Showdown.Converter({tables: true}).makeHtml(this.props.content)}}/>
            </Column>
          </Column.Group>
        </Container>
        <EditButton as={`/pages/${this.props.name}/edit`} href="/pages/[name]/edit"/>
      </Section>
    );
  }
}

export default ShowPage;
