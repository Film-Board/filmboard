import React from 'react';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';
import {Field, Control, Input, Button, Icon} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSave} from '@fortawesome/free-solid-svg-icons';
import 'react-mde/lib/styles/css/react-mde-all.css';

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

class PageEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: props.content || 'I wore a hat!',
      name: props.name || '',
      selectedTab: 'write'
    };
  }

  render() {
    return (
      <form onSubmit={event => this.props.onSubmit(event, this.state)}>
        <Field>
          <Control>
            <Input placeholder="Page name" value={this.state.name} onChange={event => this.setState({name: event.target.value})}/>
          </Control>
        </Field>
        <ReactMde
          className="content"
          value={this.state.content}
          selectedTab={this.state.selectedTab}
          generateMarkdownPreview={markdown => Promise.resolve(converter.makeHtml(markdown))}
          onChange={text => this.setState({content: text})}
          onTabChange={tab => this.setState({selectedTab: tab})}
        />
        <Button fullwidth color="success">
          <Icon size="large">
            <FontAwesomeIcon icon={faSave} size="lg"/>
          </Icon>
        </Button>
      </form>
    );
  }
}
export default PageEditor;
