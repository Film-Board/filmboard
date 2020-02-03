import React from 'react';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';
import {Field, Control, Input, Button, Level, Label, Select} from 'rbx';

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
      category: props.category || 'None',
      content: props.content || 'I wore a hat!',
      name: props.name || '',
      selectedTab: 'write'
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();

    this.props.onSubmit(event, this.state);
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <Field>
          <Label>Name</Label>
          <Control>
            <Input placeholder="Page name" value={this.state.name} onChange={event => this.setState({name: event.target.value})}/>
          </Control>
        </Field>
        <Field>
          <Label>Category</Label>
          <Control expanded>
            <Level>
              <Level.Item align="left">
                <Select.Container>
                  <Select value={this.state.category} onChange={e => this.setState({category: e.target.value})}>
                    <Select.Option>None</Select.Option>
                    {
                      this.props.categories.map(category => (
                        <Select.Option key={category.id}>{category.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Select.Container>
              </Level.Item>
              <Level.Item align="left">
                <Button as="a" href="/pages/categories/edit" color="info">Edit Categories</Button>
              </Level.Item>
            </Level>
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
        <Level>
          <Button color="success">
            Save
          </Button>
          {this.props.removable ?
            <Button
              color="danger" onClick={e => {
                e.preventDefault();
                this.props.onDelete();
              }}
            >
              Delete
            </Button> :
            <div/>}
        </Level>
      </form>
    );
  }
}

PageEditor.defaultProps = {
  removable: true
};

export default PageEditor;
