import ReactMapGL from 'react-map-gl';
import Layout from '../../components/layout';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/location.scss';

export default () => (
  <Layout>
    <ReactMapGL
      className="map"
      width={400}
      height={400}
      latitude={37.7577}
      longitude={-122.4376}
      zoom={8}
    />
  </Layout>
);
