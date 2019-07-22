import Layout from '../components/layout';
import NewMovieSearch from '../components/new-movie-search';
import Router from 'next/router';

class AddMovie extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.movieNameInput = React.createRef();
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {movieId} = this.movieNameInput.current.state;

    const movie = await (await fetch(`/api/movies/add/${movieId}`, {method: 'post'})).json();

    Router.push(`/movies/${movie.id}/edit`);
  }

  render() {
    return (
      <Layout>
        <h1 className="title">Add a movie</h1>

        <form onSubmit={this.handleSubmit}>
          <NewMovieSearch ref={this.movieNameInput}></NewMovieSearch>
          <input type="submit" className="button is-success" value="Add movie"/>
        </form>
      </Layout>
    );
  }
}
export default AddMovie;
