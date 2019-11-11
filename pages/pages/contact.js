import React from 'react';
import fetch from 'isomorphic-unfetch';
import {Container, Section, Column, Title, Field, Label, Control, Input, Icon, Select, Textarea, Button} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser, faEnvelope, faPaperPlane} from '@fortawesome/free-solid-svg-icons';

class Contact extends React.Component {
  constructor() {
    super();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetState = this.resetState.bind(this);

    this.initalState = {
      fromName: '',
      fromEmail: '',
      subjectCategory: 'Advertising',
      subjectName: '',
      message: '',
      status: 'waiting'
    };

    this.state = this.initalState;
  }

  resetState() {
    this.setState(this.initalState);
  }

  async handleSubmit() {
    this.setState({status: 'sending'});

    await fetch('/api/contact', {
      method: 'post',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setState({status: 'sent'});

    setTimeout(() => {
      this.resetState();
    }, 1000);
  }

  renderButton(status) {
    switch (status) {
      case 'sending':
        return '...';
      case 'sent':
        return 'Sent!';
      default:
        return (
          <Icon size="small">
            <FontAwesomeIcon icon={faPaperPlane}/>
          </Icon>
        );
    }
  }

  render() {
    return (
      <Section>
        <Container>
          <Column.Group centered>
            <Column size={6}>
              <Title className="has-text-centered">Talk to Us!</Title>
              <form onSubmit={e => {
                e.preventDefault();
                this.handleSubmit();
              }}
              >
                <Field horizontal>
                  <Field.Label size="normal">
                    <Label>From</Label>
                  </Field.Label>
                  <Field.Body>
                    <Field>
                      <Control expanded iconLeft>
                        <Input type="text" placeholder="Name" value={this.state.fromName} onChange={e => this.setState({fromName: e.target.value})}/>
                        <Icon size="small" align="left">
                          <FontAwesomeIcon icon={faUser}/>
                        </Icon>
                      </Control>
                    </Field>
                    <Field>
                      <Control expanded iconLeft>
                        <Input
                          placeholder="Email"
                          type="email"
                          value={this.state.fromEmail} onChange={e => this.setState({fromEmail: e.target.value})}
                        />
                        <Icon size="small" align="left">
                          <FontAwesomeIcon icon={faEnvelope}/>
                        </Icon>
                      </Control>
                    </Field>
                  </Field.Body>
                </Field>
                <Field horizontal>
                  <Field.Label size="normal">
                    <Label>Subject</Label>
                  </Field.Label>
                  <Field.Body>
                    <Field>
                      <Control>
                        <Select.Container>
                          <Select value={this.state.subjectCategory} onChange={e => this.setState({subjectCategory: e.target.value})}>
                            <Select.Option>Advertising</Select.Option>
                            <Select.Option>Movie Suggestion</Select.Option>
                            <Select.Option>Website Feedback</Select.Option>
                            <Select.Option>Live Programming</Select.Option>
                            <Select.Option>3D Glasses</Select.Option>
                            <Select.Option>Other</Select.Option>
                          </Select>
                        </Select.Container>
                      </Control>
                    </Field>
                    <Field>
                      <Control>
                        <Input placeholder="Subject" value={this.state.subjectName} onChange={e => this.setState({subjectName: e.target.value})}/>
                      </Control>
                    </Field>
                  </Field.Body>
                </Field>
                <Field horizontal>
                  <Field.Label size="normal">
                    <Label>Message</Label>
                  </Field.Label>
                  <Field.Body>
                    <Field>
                      <Control>
                        <Textarea placeholder="How can we help?" value={this.state.message} onChange={e => this.setState({message: e.target.value})}/>
                      </Control>
                    </Field>
                  </Field.Body>
                </Field>
                <Field>
                  <Button fullwidth color="success">
                    {this.renderButton(this.state.status)}
                  </Button>
                </Field>
              </form>
            </Column>
          </Column.Group>
        </Container>
      </Section>
    );
  }
}

export default Contact;
