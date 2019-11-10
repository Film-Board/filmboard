import React from 'react';
import ReactMapGL, {Popup} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/location.scss';

class Location extends React.Component {
  constructor() {
    super();

    this.state = {
      viewport: {}
    };

    this.onViewportChange = this.onViewportChange.bind(this);
  }

  onViewportChange(viewport) {
    const {width, height, ...etc} = viewport;
    this.setState({viewport: etc});
  }

  render() {
    const {viewport} = this.state;
    return (
      <div className="map-container">
        <ReactMapGL
          className="map"
          width="100vw"
          height="100vh"
          latitude={47.1179}
          longitude={-88.546}
          zoom={16}
          {...viewport}
          onViewportChange={viewport => this.onViewportChange(viewport)}
        >
          <Popup closeButton={false} latitude={47.1179} longitude={-88.546}>
            <address>
              <p>135 Fisher Hall</p>
              <p>Michigan Technological University</p>
              <p>1400 Townsend Drive</p>
              <p>Houghton, Michigan 49931</p>
            </address>
          </Popup>
        </ReactMapGL>
      </div>
    );
  }
}

export default Location;
