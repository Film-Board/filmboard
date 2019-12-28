import React from 'react';
import {Container, Section, Table, Field, Control, Title, Input, Button, Label, File, Column} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUpload} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {withAuthSync, fetchWithAuth} from '../../components/lib/auth';

dayjs.extend(relativeTime);

class Files extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: props.files,
      saving: false,
      selectedFile: undefined
    };

    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  static async getInitialProps(ctx) {
    const files = await fetchWithAuth('/api/files', {}, ctx);

    return {files};
  }

  handleFileChange(e) {
    this.setState({
      selectedFile: e.target.files[0]
    });

    this.setState({
      newFileName: e.target.files[0].name
    });
  }

  async handleUpload(e) {
    e.preventDefault();

    this.toggleSaving();

    const data = new FormData();

    data.append('file', this.state.selectedFile, this.state.selectedFile.name);

    const res = await fetchWithAuth('/api/files/upload', {
      method: 'POST',
      body: data,
      rawBody: true
    });

    // Reset input state and update table
    this.setState(({files}) => ({
      selectedFile: undefined,
      newFileName: '',
      files: [res, ...files]
    }));

    this.toggleSaving();
  }

  async updateFileName(id, newName) {
    this.toggleSaving();

    await fetchWithAuth(`/api/files/${id}`, {
      method: 'PUT',
      body: {
        name: newName
      }
    });

    this.toggleSaving();
  }

  async deleteFile(id) {
    this.toggleSaving();

    await fetchWithAuth(`/api/files/${id}`, {
      method: 'DELETE'
    });

    this.setState(({files}) => ({
      files: files.filter(file => file.id !== id)
    }));

    this.toggleSaving();
  }

  async copyToClipboard(text) {
    await navigator.clipboard.writeText(text);
  }

  toggleSaving() {
    this.setState(({saving}) => ({saving: !saving}));
  }

  render() {
    return (
      <Section>
        <Container>
          <Title size={3}>{this.state.saving ? 'Saving...' : 'Manage Files'}</Title>

          <Column.Group>

            <Column narrow>
              <form onSubmit={this.handleUpload}>
                <Field>
                  <Label>File</Label>
                  <Control>
                    <File hasName>
                      <File.Label>
                        <File.Input name="file" onChange={this.handleFileChange}/>
                        <File.CTA>
                          <File.Icon>
                            <FontAwesomeIcon icon={faUpload}/>
                          </File.Icon>
                          <File.Label as="span">Choose a File</File.Label>
                        </File.CTA>
                        <File.Name>{this.state.newFileName}</File.Name>
                      </File.Label>
                    </File>
                  </Control>
                </Field>
                <Field>
                  <Control>
                    <Button color="success" disabled={this.state.saving || this.state.selectedFile === undefined}>Add File</Button>
                  </Control>
                </Field>
              </form>
            </Column>

            <Column>
              <Table fullwidth>
                <Table.Head>
                  <Table.Row>
                    <Table.Heading>Name</Table.Heading>
                    <Table.Heading>Updated</Table.Heading>
                    <Table.Heading>Copy URL</Table.Heading>
                    <Table.Heading>Delete File</Table.Heading>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {this.state.files.map(file => (
                    <Table.Row key={file.id}>
                      <Table.Cell><Input disabled={this.state.saving} defaultValue={file.name} onBlur={e => this.updateFileName(file.id, e.target.value)}/></Table.Cell>
                      <Table.Cell>{dayjs(file.updatedAt).fromNow()}</Table.Cell>
                      <Table.Cell><Button color="info" onClick={() => this.copyToClipboard(`/static/bucket/${file.path}`)}>Copy</Button></Table.Cell>
                      <Table.Cell><Button color="danger" onClick={() => this.deleteFile(file.id)}>Delete</Button></Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Column>
          </Column.Group>
        </Container>
      </Section>
    );
  }
}

export default withAuthSync(Files);
