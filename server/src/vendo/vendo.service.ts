import { Inject, Injectable } from '@nestjs/common';
import type { HafasClient as DbVendoClient } from 'db-vendo-client';
import { getCached } from '../tools/cache';
import { Station, TimetableEntry } from './vendo.dto';

export const DB_VENDO_CLIENT = 'DB_VENDO_CLIENT';

@Injectable()
export class VendoService {
  constructor(@Inject(DB_VENDO_CLIENT) public client: DbVendoClient) { }

  async findLocations(query: string) {
    const data = await this.client.locations(query, {
      results: 5,
      language: 'de',
      addresses: false,
      poi: false,
    });

    return data.filter((item) => item.id).map((item) => new Station(item));
  }

  async getArrivals(station: string, duration: number) {
    const until = Date.now() + duration * 60 * 1000;

    const data = await getCached('/arrival/' + station, duration, async (when: Date) => {
      const res = await this.client.arrivals(station, { when });
      return res.arrivals.map((i) => new TimetableEntry(i, 'arrival'));
    });

    return data.filter((i) => i.arrival && +new Date(i.arrival) <= until);
  }

  async getDepartures(station: string, duration: number) {
    const until = Date.now() + duration * 60 * 1000;

    const data = await getCached('/departure/' + station, duration, async (when: Date) => {
      const res = await this.client.departures(station, { when });
      return res.departures.map((i) => new TimetableEntry(i, 'departure'));
    });

    return data.filter((i) => i.departure && +new Date(i.departure) <= until);
  }

  async getTimetable(station: string, duration: number) {
    const arrivals = await this.getArrivals(station, duration);
    const departures = await this.getDepartures(station, duration);

    // 1. prepare a lookup table to quickly find arrivals with the same tripId
    const items: Record<string, TimetableEntry> = {};

    // 2. add all arrivals to the lookup table
    for (const item of arrivals) items[item.tripId] = item;

    for (const item of departures) {
      if (!items[item.tripId]) {
        // 3.1 add departures without arrival to the lookup table (begin of journey)
        items[item.tripId] = item;

      } else {
        // bugfix: make a shallow copy of the arrival to prevent manipulation of cached entry
        items[item.tripId] = { ...items[item.tripId] }; // i do the cloning here for efficiency reasons...
        // the cache would be much more robust if we would do this with every cached entry but also much slower
        // CAUTION: this is not a deep clone! it is working for us, because all our the entities are flat. (at least for now)

        // 3.2. change the arrival into a stopover by mixing the departure data into the cloned arrival
        const data = items[item.tripId];
        data.type = 'stopover';
        data.departure = item.departure;
        data.platform = item.platform;
        data.destination = item.destination;
      }
    }

    // take all objects from the lookup table and sort them by departure time, resp. arrival time if it is a end of journey
    return Object.values(items).sort((a, b) => {
      const ts1 = a.arrival || a.departure;
      const ts2 = b.arrival || b.departure;
      if (ts1 === ts2) return 0;
      if (!ts1) return -1;
      if (!ts2) return 1;
      return +new Date(ts1) - +new Date(ts2);
    });
  }
}
