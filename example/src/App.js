import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

import Atlas from 'diachronic-atlas'

import style from './style.json'
import geojson from './cone.json'
import documents from './documents.json'
import 'diachronic-atlas/dist/index.css'

const App = () => {
  return (
  <Atlas 
    mapStyle={style}
    year={1950}
    basemapHandler={() => {}} 
    geojson={geojson}
    viewport={{
      latitude: 29.74991,
      longitude: -95.36026,
      zoom: 11
    }}
    viewpoints={documents}
    viewIcon={<FontAwesomeIcon icon={faCamera}/>}
  />)
}

export default App
