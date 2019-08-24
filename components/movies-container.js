import { Title, Column, Block } from 'rbx';
import Poster from "./poster";

export default props => (
  <Column.Group gapSize={7} centered>
    {props.movies.map((movie, i) => (
      <Column key={i} as="a" desktop={{ size: 'one-fifth' }} href={`/movies/${movie.id}`}>
        <Block>
          <Poster filename={movie.poster} key={movie.poster}/>
        </Block>
        <Block>
          <Title size="5" className="has-text-centered has-text-weight-medium">{movie.name}</Title>
        </Block>
      </Column>
    ))}
  </Column.Group>
);
