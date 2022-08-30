import React, {useEffect, useState} from 'react';
import ControlBar from "../components/ControlBar";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import * as Map from '../components/Map';
import Facility from "../../../shared/types/Facility";
import API from "../util/API"; // Todo: Replace with alias
import * as turf from '@turf/turf';
import FacilitiesMap from "../components/Map";

function Root() {
    const [facilities, setFacilities] = useState<Facility.BaseFacility[]>([]);

    useEffect(() => {
        (async () => {
            setFacilities(await API.getLocalParkingFacilities({lat: 51.1, lon: 5.0}))
        })();
    });

    return (
        <>
            <FacilitiesMap facilities={facilities}/>
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
