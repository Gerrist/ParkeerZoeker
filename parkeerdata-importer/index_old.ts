/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index_old.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index_old.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import {ParkingFacility} from "./src/types/parkingFacility";
import API from "./src/api";
import {ParkingFacilityType} from "./src/types/parkingFacilityType";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  PP_KV: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    await importer(env.PP_KV);
    return new Response('finished');
  },
  async scheduled(event: Event, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(importer(env.PP_KV));
  },
};

const importer = async (kv: KVNamespace) => {
  console.log('Importing facilities')
  let facilities = await API.get<API.Response.ParkingFacilities>('');

  console.log(`Received ${facilities.ParkingFacilities.length} facilities`);

  let indexValue = await kv.get('index');
  console.log({indexValue}, indexValue == undefined);

  let i = 0;
  let facilitiesIndex: {
      [key in string]: ParkingFacility
  } = JSON.parse(indexValue || '[]');
  for (const f of facilities.ParkingFacilities) {
      i++;
      let facility = await API.get<API.Response.ParkingFacilityStatic>(`/static/${f.identifier}`);
      console.log(`${i}/${facilities.ParkingFacilities.length}`, facility.parkingFacilityInformation.name, facility.parkingFacilityInformation.identifier);


      let {parkingFacilityInformation: info} = facility;

      await kv.put(`facility:${info.identifier}:static`, JSON.stringify(facility));
      console.log('put', `facility:${info.identifier}:static`);
      let newFacility: ParkingFacility = {
        address: "Adres onbekend",
        hasDynamicData: false,
        identifier: info.identifier,
        location: {
          lat: -1,
          lon: -1,
        },
        name: info.name,
        static: {},
        type: ParkingFacilityType.NORMAL
      };

      if(info.accessPoints.length > 0){
        let {accessPointLocation, accessPointAddress} = info.accessPoints[0];
        if(!!accessPointLocation){
          if(accessPointLocation.length > 0){
            newFacility.location.lat = accessPointLocation[0].latitude;
            newFacility.location.lon = accessPointLocation[0].longitude;
          }
        }

        newFacility.address = `${accessPointAddress.streetName} ${accessPointAddress.houseNumber}, ${accessPointAddress.zipcode} ${accessPointAddress.city}, ${accessPointAddress.country}`;
      }

      if(info.specifications.length > 1){
        console.log('Multiple specifications', JSON.stringify(info.specifications));
      }

      info.specifications.forEach(spec => {
        newFacility.static.normal = {total: spec.capacity};
        newFacility.static.electric = {total: spec.chargingPointCapacity};
      });

      facilitiesIndex[info.identifier] = newFacility;
  }

  console.log('put index')
  await kv.put('index', JSON.stringify(facilitiesIndex));
};
