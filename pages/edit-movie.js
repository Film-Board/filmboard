import Layout from '../components/layout';
import Router from 'next/router';
import DateTimeElement from '../components/date-time';

class EditMovie extends React.Component {
  constructor(props) {
    super(props);

    this.showtimeElements = [];

    this.state = {
      showtimeElements: this.showtimeElements
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.addShowtime = this.addShowtime.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
  }

  static async getInitialProps({query, req}) {
    return await req.models.Movie.findByPk(query.id);
  }

  addShowtime() {
    this.showtimeElements.push(<DateTimeElement/>);

    this.setState({
      showtimeElements: this.showtimeElements
    });
  }

  render() {
    return (
      <Layout>
        <h1 className="title">Edit Movie</h1>

        <div className="columns">
          <div className="column">
            <form onSubmit={this.handleSubmit}>
              <div className="field">
                <label className="label">Name</label>
                <input type="text" className="input" placeholder="Black Panther" defaultValue={this.props.name}/>
              </div>
              <div className="field">
                <label className="label">IMDB</label>
                <input type="number" className="input" placeholder="7.0" defaultValue={this.props.imdb}/>
              </div>
              <div className="field">
                <label className="label">Rotten Tomatoes</label>
                <input type="number" className="input" placeholder="70%" defaultValue={this.props.rottenTomatoes}/>
              </div>
              <div className="field">
                <label className="label">Runtime (minutes)</label>
                <input type="number" className="input" placeholder="104" defaultValue={this.props.runtime}/>
              </div>
              <div className="field">
                <label className="label">Staring</label>
                <input type="text" className="input" placeholder="104" defaultValue={this.props.staring}/>
              </div>
              <div className="field">
                <label className="label">Directed by</label>
                <input type="text" className="input" placeholder="104" defaultValue={this.props.directedBy}/>
              </div>
              <div className="field">
                <label className="label">Summery</label>
                <textarea className="textarea" placeholder="104" defaultValue={this.props.summery}/>
              </div>
              <div className="field">
                <label className="label">YouTube Trailer #</label>
                <input type="text" className="input" placeholder="104" defaultValue={this.props.youtubeTrailerId}/>
              </div>
              <h3 className="title">Showtimes</h3>
              <div className="field is-grouped">
                {this.showtimeElements}
              </div>
              <button className="button is-success" onClick={this.addShowtime}>Add Showtime</button>
              <input type="submit" className="button is-success" value="Save movie"/>
            </form>
          </div>
          <div className="column">
            <img src={"/static/images/posters/" + this.props.poster}/>
          </div>
        </div>
      </Layout>
    );
  }
}
export default EditMovie;
