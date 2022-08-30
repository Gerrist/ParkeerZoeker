import React from 'react';
import ControlBar from "../components/ControlBar";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import * as Map from '../components/Map';

function Root() {
    return (
        <>
            <Map.LeafletContainer center={[51.98507139487303, 5.908378522149942]} zoom={13} zoomControl={false}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                />
                <Marker position={[51.98507139487303, 5.908378522149942]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </Map.LeafletContainer>
            <ControlBar items={[
                {
                    id: 'map',
                    active: true,
                    icon: 'square-parking',
                    target: 'map'
                },
                {
                    id: 'search',
                    active: false,
                    icon: 'magnifying-glass-location',
                    target: 'search'
                },
                {
                    id: 'settings',
                    active: false,
                    icon: 'gear',
                    target: 'settings'
                },
            ]}/>
        </>
    );
}

export default Root;
