import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Marker, Source, Layer } from 'react-map-gl';

const MarkerIcon = ({ image, index, markerHandler, viewIcon }) => (
  <Marker {...image} offsetLeft={-15} offsetTop={-15}>
    <div
      role="button"
      tabIndex={index}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: '50%',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
      onClick={() => markerHandler(image.ssid)}
      onKeyPress={() => markerHandler(image.ssid)}
    >
      {viewIcon}
    </div>
  </Marker>
);

MarkerIcon.propTypes = {
  image: PropTypes.shape().isRequired,
  index: PropTypes.number.isRequired,
  markerHandler: PropTypes.func.isRequired,
  viewIcon: PropTypes.node,
};

MarkerIcon.defaultProps = {
  viewIcon: null,
};

const Circle = ({ viewpoints, visible }) => {
  const geojson = {
    type: 'FeatureCollection',
    features: viewpoints.map((v, i) => ({
      type: 'Feature',
      id: i,
      properties: {
        ssid: v.ssid,
        title: v.title,
      },
      geometry: {
        type: 'Point',
        coordinates: [v.longitude, v.latitude],
      },
    })),
  };

  return (
    <Source type="geojson" data={geojson} id="viewpoints">
      <Layer
        id="viewpoints"
        type="circle"
        layout={{ visibility: visible ? 'visible' : 'none' }}
        paint={{
          'circle-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#FFFFFF',
            '#000000',
          ],
          'circle-stroke-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#000000',
            '#FFFFFF',
          ],
          'circle-stroke-width': 2,
        }}
      />
    </Source>
  );
};

Circle.propTypes = {
  viewpoints: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  visible: PropTypes.bool,
};

Circle.defaultProps = {
  visible: true,
};

const ViewMarkers = ({ viewpoints, markerHandler, viewIcon, circleMarkers, visible }) => {
  if (!viewpoints || !Array.isArray(viewpoints)) return null;

  if (circleMarkers) {
    return <Circle viewpoints={viewpoints} visible={visible} />;
  }
  return (
    <>
      {viewpoints.map((v, i) => (
        <MarkerIcon
          key={`marker${v.ssid}`}
          image={v}
          index={i}
          markerHandler={markerHandler}
          viewIcon={viewIcon}
        />
      ))}
    </>
  );
};

ViewMarkers.propTypes = {
  viewpoints: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  markerHandler: PropTypes.func,
  viewIcon: PropTypes.node,
  circleMarkers: PropTypes.bool,
  visible: PropTypes.bool,
};

ViewMarkers.defaultProps = {
  viewIcon: null,
  markerHandler: () => null,
  circleMarkers: false,
  visible: true,
};

export default ViewMarkers;
