import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

import { Atlas, getLegend } from 'diachronic-atlas';

import style from './style.json';
import cone from './cone.json';
import documents from './documents.json';

const App = () => {
  const [layers, setLayers] = useState(null);
  const [legend, setLegend] = useState(null);
  const [highlightedLayer, setHighlightedLayer] = useState(null);
  const [heading, setHeading] = useState(0);
  const [geojson, setGeoJson] = useState([{id: 'asdlkjldlkj', data: cone, paint: { 'fill-color': 'rgba(0,0,0,0.25)' }}]);

  // setTimeout(() => {
  //   setGeoJson([{id: 'testjson', data: cone, paint: { 'fill-color': 'rgba(0,0,0,0.25)' }}]);
  // }, 3000);

  if (!layers)
    axios.get('https://search.imaginerio.org/layers/').then(({ data }) => setLayers(data[0].layers));

  useEffect(() => {
    if (layers) {
      setLegend(
        layers.map(layer => ({
          ...layer,
          types: layer.types.map(type => getLegend({ layer, type, style })),
        }))
      );
    }
  }, [layers]);

  return (
    <>
      <Atlas
        mapStyle={style}
        year={1800}
        basemapHandler={ssid => console.log(ssid)}
        geojson={geojson}
        viewport={{
          latitude: -22.90415,
          longitude: -43.17425,
          zoom: 15,
        }}
        showSatellite
        viewpoints={documents}
        viewIcon={<FontAwesomeIcon icon={faCamera} />}
        circleMarkers
        hoverHandler={e => console.log(e)}
        highlightedLayer={highlightedLayer}
        rasterUrl="https://imaginerio-rasters.s3.us-east-1.amazonaws.com"
        // activeBasemap="24048803"
        bearing={heading}
        // isDrawing
        clickHandler={e => console.log(e)}
        bboxHandler={e => console.log(e)}
      />

      {legend && (
        <div className="legend-container">
          {legend.map(layer => {
            return (
              <div key={layer.name} className="legend-layer">
                <p>{layer.title}</p>
                {layer.types.map(type => (
                  <div
                    key={type.type}
                    className="legend-type"
                    onClick={() =>
                      setHighlightedLayer(
                        highlightedLayer &&
                          layer.name === highlightedLayer.layer &&
                          type.type === highlightedLayer.type
                          ? null
                          : { layer: layer.name, type: type.type }
                      )
                    }
                  >
                    <p>{type.type}</p>
                    <div className="legend-swatch" style={
                      type.swatch.children
                        ? { color: type.swatch.color }
                        : {
                            backgroundColor: type.swatch.backgroundColor,
                            borderColor: type.swatch.borderColor,
                            borderWidth: type.swatch.borderWidth ? `${type.swatch.borderWidth}px` : undefined,
                            borderStyle: type.swatch.borderWidth ? 'solid' : undefined
                          }
                    }>
                      {type.swatch.children}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default App;
