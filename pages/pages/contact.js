import React from 'react';
import {Container, Section, Column, Title, Field, Label, Control, Input, Icon, Select, Textarea, Button} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser, faEnvelope, faPaperPlane} from '@fortawesome/free-solid-svg-icons';

class Contact extends React.Component {
  render() {
    return (
      <Section>
        <Container>
          <Column.Group centered>
            <Column size={6}>
              <Title className="has-text-centered">Talk to Us!</Title>
              <form>
                <Field horizontal>
                  <Field.Label size="normal">
                    <Label>From</Label>
                  </Field.Label>
                  <Field.Body>
                    <Field>
                      <Control expanded iconLeft>
                        <Input type="text" placeholder="Name"/>
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
                          <Select>
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
                        <Input placeholder="Subject"/>
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
                        <Textarea placeholder="How can we help?"/>
                      </Control>
                    </Field>
                  </Field.Body>
                </Field>
                <Field>
                  <Button fullwidth color="success">
                    <Icon size="small">
                      <FontAwesomeIcon icon={faPaperPlane}/>
                    </Icon>
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
