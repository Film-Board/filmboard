import Autosuggest from 'react-autosuggest-bulma-pure';

const getSuggestions = async value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  if (inputLength === 0) {
    return [];
  }

  const movies = await (await fetch(`/api/movies/autosuggest/${inputValue}`)).json();

  console.log(movies);

  return movies;
};

const getSuggestionValue = suggestion => suggestion.title;

class NewMovieSearch extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      movieId: '',
      suggestions: []
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
  }

  onChange(event, {newValue}) {
    this.setState({
      value: newValue
    });
  }

  async onSuggestionsFetchRequested({value}) {
    this.setState({
      suggestions: await getSuggestions(value)
    });
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  }

  shouldRenderSuggestions(v) {
    return v.trim().length > 2;
  }

  renderSuggestion(suggestion) {
    this.setState({
      movieId: suggestion.id
    });

    return (
      <div className="tile">
        {suggestion.title}
      </div>
    );
  }

  render() {
    const {value, suggestions} = this.state;

    const inputProps = {
      placeholder: 'Start typing a movie\'s name to add it...',
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default NewMovieSearch;
