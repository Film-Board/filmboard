import { Container, Title } from 'rbx';
import MoviesContainer from './movies-container';

export default props => (
  <Container>
    <Title size={1}>Upcoming</Title>
    <MoviesContainer movies={props.movies}/>
  </Container>
);
