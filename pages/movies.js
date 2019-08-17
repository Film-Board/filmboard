import React from 'react';
import fetch from 'isomorphic-unfetch';
import { Column, Block, Container, Section, Title } from 'rbx';
import { getBaseURL } from '../common/helpers';
import Layout from '../components/layout';
import Poster from '../components/poster';
import './styles/all-movies.scss';

class AllMovies extends React.Component {
  static async getInitialProps({ req }) {
    const movies = await fetch(`${getBaseURL(req)}/api/movies`);

    return { movies: await movies.json() };
  }

  render() {
    return (
      <Layout>
        <Section>
          <Container>
            <Title className="has-text-white" size={1}>Upcoming</Title>
            <Column.Group gapSize={7} centered>
              {this.props.movies.map(movie => (
                <Column as="a" desktop={{ size: 'one-fifth' }} href={`/movies/${movie.id}`}>
                  <Block>
                    <Poster filename={movie.poster} key={movie.poster}/>
                  </Block>
                  <Block>
                    <Title size="5" className="has-text-centered has-text-weight-medium has-text-white">{movie.name}</Title>
                  </Block>
                </Column>
              ))}
            </Column.Group>
          </Container>
        </Section>
      </Layout>
    );
  }
}

export default AllMovies;
