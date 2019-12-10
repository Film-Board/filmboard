import React from 'react';
import {Container, Section, Field, Control, Title, Input, Button, Label} from 'rbx';
import {withAuthSync, fetchWithAuth} from '../../components/lib/auth';

class EditBanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bannerContent: props.bannerContent,
      saving: false
    };

    this.editBanner = this.editBanner.bind(this);
    this.toggleSaving = this.toggleSaving.bind(this);
  }

  static async getInitialProps(ctx) {
    const banner = await fetchWithAuth('/api/keystore?name=banner', { }, ctx);

    let bannerContent = '';

    if (banner.value && banner.value.banner) {
      bannerContent = banner.value.banner;
    }

    return {bannerContent};
  }

  async editBanner(e) {
    e.preventDefault();

    this.toggleSaving();

    await fetchWithAuth('/api/keystore?name=banner', {
      method: 'PUT',
      body: {value: {banner: this.state.bannerContent}}
    });

    this.toggleSaving();
  }

  toggleSaving() {
    this.setState(({saving}) => ({
      saving: !saving
    }));
  }

  render() {
    return (
      <Section>
        <Container>
          <Title size={3} className="has-text-centered">Edit Banner</Title>

          <form onSubmit={this.editBanner}>
            <Field horizontal>
              <Field.Label size="normal">
                <Label>Content</Label>
              </Field.Label>
              <Field.Body>
                <Field>
                  <Control>
                    <Input disabled={this.state.saving} type="text" placeholder="tip: you can use emojis too 👍" value={this.state.bannerContent} onChange={e => this.setState({bannerContent: e.target.value})}/>
                  </Control>
                </Field>
                <Field>
                  <Control>
                    <Button disabled={this.state.saving} color="success">update</Button>
                  </Control>
                </Field>
              </Field.Body>
            </Field>
          </form>
        </Container>
      </Section>
    );
  }
}

export default withAuthSync(EditBanner);
