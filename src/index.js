import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, { Source, Layer, NavigationControl } from 'react-map-gl';

import ViewMarkers from './ViewMarkers';

import { setStyleYear, fitBounds, setActiveLayer, updateBearing } from './mapUtils';
import { requireAtLeastOne } from './utils';
import getLegend from './getLegend';

const Atlas = ({
  width,
  height,
  year,
  dates,
  activeBasemap,
  opacity,
  basemapHandler,
  highlightedLayer,
  geojson,
  hover,
  hoverHandler,
  viewpoints,
  mapStyle,
  rasterUrl,
  viewIcon,
  viewport,
  circleMarkers,
  bearing,
}) => {
  const mapRef = useRef(null);
  const geoRef = useRef(null);
  const styleRef = useRef(JSON.stringify(mapStyle));

  const [mapViewport, setMapViewport] = useState({
    ...viewport,
    width,
    height,
  });
  const [hoveredStateId, setHoveredStateId] = useState(null);
  const [style, setStyle] = useState(mapStyle);

  useEffect(() => {
    setMapViewport({
      ...mapViewport,
      width,
      height,
    });
  }, [width, height]);

  const onViewportChange = nextViewport => {
    setMapViewport(nextViewport);
  };

  useEffect(() => {
    const map = mapRef.current.getMap();
    if (map) {
      const range = dates || [year, year];
      setStyle(setActiveLayer(setStyleYear(range, JSON.parse(styleRef.current)), highlightedLayer));
    }
  }, [year, dates, highlightedLayer]);

  useEffect(() => {
    geojson.forEach(({ id, data }) => {
      if (geoRef.current !== id) {
        setMapViewport(fitBounds(data, mapViewport));
        geoRef.current = id;
      }
    });
  }, [geojson]);

  useEffect(() => setMapViewport(updateBearing(bearing, mapViewport)), [bearing]);

  return (
    <ReactMapGL
      ref={mapRef}
      mapStyle={style}
      onViewportChange={onViewportChange}
      interactiveLayerIds={viewpoints ? ['viewpoints'] : null}
      onClick={e => {
        const [feature] = e.features;
        if (feature) basemapHandler(feature.properties.ssid);
      }}
      onHover={e => {
        if (!viewpoints) return;

        if (hoveredStateId !== null) {
          mapRef.current
            .getMap()
            .setFeatureState({ source: 'viewpoints', id: hoveredStateId }, { hover: false });
        }
        if (e.features.length > 0) {
          mapRef.current
            .getMap()
            .setFeatureState({ source: 'viewpoints', id: e.features[0].id }, { hover: true });
          setHoveredStateId(e.features[0].id);
        } else {
          setHoveredStateId(null);
        }
        hoverHandler(e);
      }}
      {...mapViewport}
    >
      <Source
        type="geojson"
        data={{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        }}
      >
        <Layer id="placeholder" type="circle" paint={{ 'circle-opacity': 0 }} />
      </Source>
      {rasterUrl && activeBasemap && (
        <Source
          key={activeBasemap}
          type="raster"
          tiles={[`${rasterUrl}/${activeBasemap}/{z}/{x}/{y}.png`]}
          scheme="tms"
        >
          <Layer
            id="overlay"
            type="raster"
            beforeId="placeholder"
            paint={{ 'raster-opacity': opacity }}
          />
        </Source>
      )}
      {geojson.map(({ id, data, paint, type }) => (
        <Source key={id} type="geojson" data={data}>
          <Layer id={id} type={type || 'fill'} paint={paint} />
        </Source>
      ))}
      {hover && (
        <Source key="view-hover" type="geojson" data={hover}>
          <Layer id="view-hover" type="fill" paint={{ 'fill-color': 'rgba(0,0,0,0.25)' }} />
        </Source>
      )}
      <ViewMarkers
        visible={!highlightedLayer}
        viewpoints={viewpoints}
        markerHandler={ssid => {
          if (ssid !== activeBasemap) basemapHandler(ssid);
        }}
        viewIcon={viewIcon}
        circleMarkers={circleMarkers}
      />
      <div
        className="atlas___zoom-controls"
        style={{ position: 'absolute', left: 15, right: 'auto', top: 15 }}
      >
        <NavigationControl />
      </div>
    </ReactMapGL>
  );
};

const dateProps = requireAtLeastOne({
  year: PropTypes.number,
  dates: PropTypes.arrayOf(PropTypes.number),
});

Atlas.propTypes = {
  year: dateProps,
  dates: dateProps,
  activeBasemap: PropTypes.string,
  opacity: PropTypes.number,
  basemapHandler: PropTypes.func,
  highlightedLayer: PropTypes.shape(),
  width: PropTypes.number,
  height: PropTypes.number,
  geojson: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      data: PropTypes.shape().isRequired,
      type: PropTypes.oneOf(['fill', 'line', 'circle', 'symbol']),
      paint: PropTypes.shape(),
    })
  ),
  hover: PropTypes.shape(),
  hoverHandler: PropTypes.func,
  viewpoints: PropTypes.arrayOf(
    PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      ssid: PropTypes.string,
    })
  ),
  mapStyle: PropTypes.shape().isRequired,
  rasterUrl: PropTypes.string,
  viewIcon: PropTypes.node,
  viewport: PropTypes.shape().isRequired,
  circleMarkers: PropTypes.bool,
  bearing: PropTypes.number,
};

Atlas.defaultProps = {
  year: null,
  dates: null,
  activeBasemap: null,
  opacity: 0.75,
  width: 800,
  height: 600,
  highlightedLayer: null,
  geojson: [],
  hover: null,
  hoverHandler: () => null,
  viewpoints: null,
  rasterUrl: null,
  viewIcon: null,
  basemapHandler: () => null,
  circleMarkers: false,
  bearing: 0,
};

export default Atlas;

export { Atlas, getLegend };
