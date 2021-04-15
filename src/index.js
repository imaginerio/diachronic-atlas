import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, { Source, Layer, Marker, NavigationControl } from 'react-map-gl';
import { Box, IconButton } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

import { setStyleYear, fitBounds, setActiveLayer } from './mapUtils';

const Atlas = ({
  size,
  year,
  activeBasemap,
  opacity,
  basemapHandler,
  highlightedLayer,
  viewcone,
  viewpoints,
  mapStyle,
  mapBounds,
  rasterUrl,
}) => {
  const mapRef = useRef(null);

  const [mapViewport, setMapViewport] = useState({
    latitude: 29.74991,
    longitude: -95.36026,
    zoom: 11,
  });

  useEffect(() => {
    const map = mapRef.current.getMap();
    if (map) {
      map.setStyle(setActiveLayer(setStyleYear(year, mapStyle), highlightedLayer));
    }
  }, [year, highlightedLayer]);

  useEffect(async () => {
    if (mapBounds || viewcone) {
      setMapViewport(fitBounds(viewcone, mapViewport, mapBounds));
    }
  }, [mapBounds, viewcone]);

  useEffect(() => {
    setMapViewport({
      ...mapViewport,
      ...size,
    });
  }, [size]);

  const onViewportChange = nextViewport => {
    setMapViewport(nextViewport);
  };

  return (
    <ReactMapGL
      ref={mapRef}
      mapStyle={mapStyle}
      onViewportChange={onViewportChange}
      {...mapViewport}
    >
      {rasterUrl && activeBasemap && !viewcone && (
        <Source
          key={activeBasemap}
          type="raster"
          tiles={[`${rasterUrl}/${activeBasemap}/{z}/{x}/{y}.png`]}
          scheme="tms"
        >
          <Layer id="overlay" type="raster" paint={{ 'raster-opacity': opacity }} />
        </Source>
      )}
      {viewcone && (
        <Source key={`view${activeBasemap}`} type="geojson" data={viewcone}>
          <Layer id="viewcone" type="fill" paint={{ 'fill-color': 'rgba(0,0,0,0.25)' }} />
        </Source>
      )}
      {viewpoints.map(v => (
        <Marker key={`marker${v.ssid}`} {...v} offsetLeft={-15} offsetTop={-15}>
          <IconButton
            icon={<FontAwesomeIcon icon={faCamera} />}
            as="div"
            w="30px"
            h="30px"
            minWidth="none"
            borderRadius="50%"
            backgroundColor="white"
            boxShadow="md"
            onClick={() => {
              if (v.ssid !== activeBasemap) basemapHandler(v.ssid);
            }}
          />
        </Marker>
      ))}
      <Box pos="absolute" left={['auto', '15px']} right={['40px', 'auto']} top="15px">
        <NavigationControl />
      </Box>
    </ReactMapGL>
  );
};

Atlas.propTypes = {
  year: PropTypes.number.isRequired,
  activeBasemap: PropTypes.string,
  opacity: PropTypes.number,
  basemapHandler: PropTypes.func.isRequired,
  highlightedLayer: PropTypes.shape(),
  size: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  viewcone: PropTypes.shape(),
  viewpoints: PropTypes.arrayOf(
    PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      ssid: PropTypes.string,
    })
  ),
  mapStyle: PropTypes.shape().isRequired,
  rasterUrl: PropTypes.string,
  mapBounds: PropTypes.arrayOf(PropTypes.number),
};

Atlas.defaultProps = {
  activeBasemap: null,
  opacity: 0.75,
  size: {
    width: 800,
    height: 600,
  },
  highlightedLayer: null,
  viewcone: null,
  viewpoints: [],
  mapBounds: null,
  rasterUrl: null,
};

export default Atlas;