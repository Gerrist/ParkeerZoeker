import API from "./api";
import {createClient} from "redis";
import axios from "axios";
import {ParkingFacility} from "./types/parkingFacility";
import * as turf from "@turf/turf";
import slugify from "slugify";

const run = async () => {
    console.log("ParkeerZoeker Importer");
    console.log("Connecting to redis")

    const client = createClient({
        url: "redis://parkeerzoeker.nl",
        password: "IZvAKWWIt3eaFAtAAQXpQAjhI60XaFoK"
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    try {
        console.log('Importing facilities');
        console.time("import");

        let indexContent: {
            [key in string]: ParkingFacility
        } = {};

        let facilities = await API.get<API.Response.ParkingFacilities>('');

        console.log(`Received ${facilities.ParkingFacilities.length} facilities`);

        let progress = 0;

        for (const facility of facilities.ParkingFacilities) {
            let hasLocation = false;
            let hasStatic = false;
            let indexFacility: ParkingFacility = {
                address: "Unknown",
                hasDynamicData: 'dynamicDataUrl' in facility,
                identifier: facility.identifier,
                location: {lat: 0, lon: 0},
                name: "Unknown",
                static: {
                    normal: {
                        total: -1,
                    },
                    electric: {
                        total: -1,
                    }
                },
                type: "unknown"
            };

            if ('staticDataUrl' in facility) {
                let staticContent = await API.get<API.Response.ParkingFacilityStatic>(facility.staticDataUrl, true);

                hasStatic = true;

                indexFacility.name = staticContent.parkingFacilityInformation.name;
                if(staticContent.parkingFacilityInformation.specifications.length > 0){
                    let firstSpec = staticContent.parkingFacilityInformation.specifications[0];
                    indexFacility.static.normal.total = firstSpec.capacity;
                    indexFacility.static.electric.total = firstSpec.chargingPointCapacity;

                    indexFacility.type = slugify(firstSpec.usage);
                }

                if(staticContent.parkingFacilityInformation.accessPoints.length == 0){
                    let areaCenter: {lat: number, lon: number} = null;
                    if(staticContent.parkingFacilityInformation.specifications.length > 0){
                        staticContent.parkingFacilityInformation.specifications.forEach(spec => {
                            if('areaGeometry' in spec) {
                                let center = turf.centerOfMass(turf.feature(spec.areaGeometry));
                                areaCenter = {
                                    lat: center.geometry.coordinates[1],
                                    lon: center.geometry.coordinates[0],
                                }
                            }
                        });
                    }

                    if(areaCenter){
                        indexFacility.location = areaCenter;
                        hasLocation = true;
                    }
                } else {
                    staticContent.parkingFacilityInformation.accessPoints.forEach(accessPoint => {
                        if('accessPointLocation' in accessPoint && accessPoint.accessPointLocation.length > 0){
                            indexFacility.location.lat = accessPoint.accessPointLocation[0].latitude;
                            indexFacility.location.lon = accessPoint.accessPointLocation[0].longitude;
                            hasLocation = true;
                        }
                    });
                }

                staticContent.parkingFacilityInformation.accessPoints.forEach(accessPoint => {
                    if('accessPointAddress' in accessPoint && accessPoint.isVehicleEntrance){
                        indexFacility.address = `${accessPoint.accessPointAddress.streetName} ${accessPoint.accessPointAddress.houseNumber}, ${accessPoint.accessPointAddress.zipcode} ${accessPoint.accessPointAddress.city}, ${accessPoint.accessPointAddress.country}`;
                    }
                });

                if(hasLocation){
                    await client.set(`facility:${facility.identifier}:static`, JSON.stringify(staticContent));
                }
            }
            if ('dynamicDataUrl' in facility && hasLocation && hasStatic) {
                let dynamicContent = await API.get<API.Response.ParkingFacilityDynamic>(facility.dynamicDataUrl, true);
                indexFacility.dynamic = {
                    normal: {
                        total: -1,
                        free: -1
                    },
                    electric: {
                        total: -1,
                        free: -1
                    }
                }
                if('actualStatus' in dynamicContent){
                    indexFacility.dynamic.normal.free = dynamicContent.actualStatus.vacantSpaces || -1;
                    indexFacility.dynamic.electric.free = dynamicContent.actualStatus.chargePointVacantSpaces || -1;
                }


                await client.set(`facility:${facility.identifier}:dynamic`, JSON.stringify(dynamicContent));
            }

            indexContent[indexFacility.identifier] = indexFacility;
            progress++;
            console.log(`${progress}/${facilities.ParkingFacilities.length}`);


        }


        console.timeEnd("import");
        console.log("Done importing. Disconnecting and exiting...");
        await client.disconnect();
        process.exit();
    } catch (e) {
        console.error(e);
    }
};


run();