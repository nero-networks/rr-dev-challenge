import type {
  Alternative,
  Location,
  Stop,
  Station as VendoStation,
} from 'db-vendo-client';
import { shaHash } from '../tools';

export class Station {
  id: string;
  name: string;

  constructor(item: VendoStation | Stop | Location) {
    if (!item.id) throw new Error('items without id must be filtered out!');
    this.id = item.id;
    this.name = item.name || this.id;
  }
}

export class TimetableEntry {
  type: 'arrival' | 'departure' | 'stopover';
  line?: string;
  lineType?: string;
  delay?: number;
  platform?: string;
  arrival?: string;
  departure?: string;
  origin?: string;
  destination?: string;
  tripId: string;

  constructor(item: Alternative, type: 'arrival' | 'departure') {
    this.type = type;
    this.delay = item.delay;
    this.platform = item.platform;
    this.line = item.line?.name;
    if (this.line) this.lineType = this.line.split(' ')[0].toUpperCase();

    this.tripId = shaHash(item.tripId); // shorten the rediculous long prisma id, we use it for arrival matching only

    if (type === 'arrival') {
      this.arrival = item.when;
      this.origin = item.provenance;
    }

    if (type === 'departure') {
      this.departure = item.when;
      this.destination = item.direction;
    }
  }
}
