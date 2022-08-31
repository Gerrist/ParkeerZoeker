"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const redis_1 = require("redis");
const turf = require("@turf/turf");
const slugify_1 = require("slugify");
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("ParkeerZoeker Importer");
    console.log("Connecting to redis");
    const client = (0, redis_1.createClient)({
        url: "redis://parkeerzoeker.nl",
        password: "IZvAKWWIt3eaFAtAAQXpQAjhI60XaFoK"
    });
    client.on('error', (err) => console.log('Redis Client Error', err));
    yield client.connect();
    try {
        console.log('Importing facilities');
        console.time("import");
        let indexContent = {};
        let facilities = yield api_1.default.get('');
        console.log(`Received ${facilities.ParkingFacilities.length} facilities`);
        let progress = 0;
        for (const facility of facilities.ParkingFacilities) {
            let hasLocation = false;
            let hasStatic = false;
            let indexFacility = {
                address: "Unknown",
                hasDynamicData: 'dynamicDataUrl' in facility,
                identifier: facility.identifier,
                location: { lat: 0, lon: 0 },
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
                let staticContent = yield api_1.default.get(facility.staticDataUrl, true);
                hasStatic = true;
                indexFacility.name = staticContent.parkingFacilityInformation.name;
                if (staticContent.parkingFacilityInformation.specifications.length > 0) {
                    let firstSpec = staticContent.parkingFacilityInformation.specifications[0];
                    indexFacility.static.normal.total = firstSpec.capacity;
                    indexFacility.static.electric.total = firstSpec.chargingPointCapacity;
                    indexFacility.type = (0, slugify_1.default)(firstSpec.usage);
                }
                if (staticContent.parkingFacilityInformation.accessPoints.length == 0) {
                    let areaCenter = null;
                    if (staticContent.parkingFacilityInformation.specifications.length > 0) {
                        staticContent.parkingFacilityInformation.specifications.forEach(spec => {
                            if ('areaGeometry' in spec) {
                                let center = turf.centerOfMass(turf.feature(spec.areaGeometry));
                                areaCenter = {
                                    lat: center.geometry.coordinates[1],
                                    lon: center.geometry.coordinates[0],
                                };
                            }
                        });
                    }
                    if (areaCenter) {
                        indexFacility.location = areaCenter;
                        hasLocation = true;
                    }
                }
                else {
                    staticContent.parkingFacilityInformation.accessPoints.forEach(accessPoint => {
                        if ('accessPointLocation' in accessPoint && accessPoint.accessPointLocation.length > 0) {
                            indexFacility.location.lat = accessPoint.accessPointLocation[0].latitude;
                            indexFacility.location.lon = accessPoint.accessPointLocation[0].longitude;
                            hasLocation = true;
                        }
                    });
                }
                staticContent.parkingFacilityInformation.accessPoints.forEach(accessPoint => {
                    if ('accessPointAddress' in accessPoint && accessPoint.isVehicleEntrance) {
                        indexFacility.address = `${accessPoint.accessPointAddress.streetName} ${accessPoint.accessPointAddress.houseNumber}, ${accessPoint.accessPointAddress.zipcode} ${accessPoint.accessPointAddress.city}, ${accessPoint.accessPointAddress.country}`;
                    }
                });
                if (hasLocation) {
                    yield client.set(`facility:${facility.identifier}:static`, JSON.stringify(staticContent));
                }
            }
            if ('dynamicDataUrl' in facility && hasLocation && hasStatic) {
                let dynamicContent = yield api_1.default.get(facility.dynamicDataUrl, true);
                indexFacility.dynamic = {
                    normal: {
                        total: -1,
                        free: -1
                    },
                    electric: {
                        total: -1,
                        free: -1
                    }
                };
                if ('actualStatus' in dynamicContent) {
                    indexFacility.dynamic.normal.free = dynamicContent.actualStatus.vacantSpaces || -1;
                    indexFacility.dynamic.electric.free = dynamicContent.actualStatus.chargePointVacantSpaces || -1;
                }
                yield client.set(`facility:${facility.identifier}:dynamic`, JSON.stringify(dynamicContent));
            }
            indexContent[indexFacility.identifier] = indexFacility;
            progress++;
            console.log(`${progress}/${facilities.ParkingFacilities.length}`);
        }
        console.timeEnd("import");
        console.log("Done importing. Disconnecting and exiting...");
        yield client.disconnect();
        process.exit();
    }
    catch (e) {
        console.error(e);
    }
});
run();
//# sourceMappingURL=index.js.map