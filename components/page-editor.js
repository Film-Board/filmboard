import React from 'react';
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import { Field, Control, Input, Button } from 'rbx';
import "react-mde/lib/styles/css/react-mde-all.css";

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
      content: props.content || '',
      name: props.name || '',
      selectedTab: 'write'
    };
  }

  render() {
    return (
      <form onSubmit={event => this.props.onSubmit(event, this.state)}>
        <Field>
          <Control>
            <Input placeholder="Page name" value={this.state.name} onChange={event => this.setState({ name: event.target.value })}/>
          </Control>
        </Field>
        <ReactMde
          className="content"
          value={this.state.content}
          onChange={text => this.setState({ content: text })}
          selectedTab={this.state.selectedTab}
          onTabChange={tab => this.setState({ selectedTab: tab })}
          generateMarkdownPreview={markdown => Promise.resolve(converter.makeHtml(markdown))}
        />
        <Button color="success" fullwidth>Save Page</Button>
      </form>
    );
  }
}
export default PageEditor;
