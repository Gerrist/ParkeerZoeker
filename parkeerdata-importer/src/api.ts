import axios from "axios";

namespace API {
    export const apiUrl = 'https://npropendata.rdw.nl/parkingdata/v2';

    export namespace Response {
        export type ParkingFacilities = {
            ParkingFacilities: {
                name: string,
                identifier: string,
                staticDataUrl: string,
                dynamicDataUrl?: string,
                limitedAccess: boolean,
                staticDataLastUpdated: number
            }[]
        }
        export type ParkingFacilityStatic = {
            parkingFacilityInformation: {
                description: string;
                identifier: string;
                validityStartOfPeriod: number;
                validityEndOfPeriod: number;
                name: string;
                limitedAccess: boolean;
                specifications: {
                    validityStartOfPeriod: number;
                    capacity: number;
                    chargingPointCapacity: number;
                    disabledAccess: number;
                    minimumHeightInMeters: number;
                    usage: string;
                    areaGeometry?: {
                        type: string,
                        coordinates: [number, number][][]
                    }
                }[];
                operator: {
                    validityStartOfPeriod: number;
                    validityEndOfPeriod: number;
                    name: string;
                    administrativeAddresses: {
                        emailAddresses: string[];
                        streetName: string;
                        houseNumber: string;
                        zipcode: string;
                        city: string;
                        province: string;
                        country: string;
                        phoneNumbers: string[];
                    }[];
                    postalAddress: {
                        emailAddresses: string[];
                        streetName: string;
                        houseNumber: string;
                        zipcode: string;
                        city: string;
                        province: string;
                        country: string;
                        phoneNumbers: string[];
                    }[];
                    url: string;
                }[];
                contactPersons: {}[]; // Todo: Implement contactPersons
                accessPoints: {
                    validityStartOfPeriod: number,
                    isVehicleEntrance: boolean,
                    isVehicleExit: boolean,
                    isPedestrianEntrance: boolean,
                    isPedestrianExit: boolean,
                    alias: string,
                    accessPointLocation: {
                        validityStartOfPeriod: number,
                        coordinatesType: string,
                        latitude: number,
                        longitude: number
                    }[],
                    accessPointAddress: {
                        emailAddresses: string[],
                        streetName: string,
                        houseNumber: string,
                        zipcode: string,
                        city: string,
                        province: string,
                        country: string,
                        phoneNumbers: string[]
                    }
                }[];
                openingTimes: {
                    openAllYear: boolean,
                    periodName: string,
                    startOfPeriod: number,
                    exitPossibleAllDay: boolean,
                    entryTimes: {
                        validityStartOfPeriod: number,
                        enterFrom: {
                            h: number,
                            m: number,
                            s: number
                        },
                        enterUntil: {
                            h: number,
                            m: number,
                            s: number
                        },
                        dayNames: string[]
                    }[];
                }[];
                tariffs: {
                    tariffDescription: string,
                    periodName: string,
                    startOfPeriod: number,
                    endOfPeriod: number,
                    validityDays: string[],
                    validityFromTime: {
                        h: number,
                        m: number,
                        s: number
                    },
                    validityUntilTime: {
                        h: number,
                        m: number,
                        s: number
                    },
                    intervalRates: {
                        validityStartOfPeriod: number,
                        validityEndOfPeriod: number,
                        charge: number,
                        chargePeriod: number,
                        durationType: string,
                        durationFrom: number,
                        durationUntil: number
                    }[]
                }[];
            }
            paymentMethods: {}[]; // Todo: implement paymentMethods
            specialDays: {
                specialDayName: string;
                specialDayDates: string[];
            }[];
        }

        export type ParkingFacilityDynamic = {
            "description": string,
            "identifier": string,
            "name": string,
            "actualStatus": {
                "chargePointVacantSpaces": number,
                "full": boolean,
                "lastUpdated": string,
                "open": boolean,
                "parkingCapacity": number,
                "statusDescription": string,
                "vacantSpaces": number
            }
        }
    }

    export const get = <T>(endpoint: string, noHostname: boolean = false): Promise<T> => {
        return new Promise<T>((resolve, reject) => {
            axios.get(`${!noHostname ? apiUrl : ''}${endpoint}`).then(async (res) => {
                resolve(res.data as T);
            }).catch(err => {
                reject(err);
            });
        });
    }
}

export default API;
