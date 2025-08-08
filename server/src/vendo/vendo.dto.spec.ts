import { Alternative, Station as VendoStation } from 'db-vendo-client';
import { shaHash } from '../tools';
import { Station, TimetableEntry } from './vendo.dto';


describe('DTOs', () => {
  describe('TimetableEntry', () => {
    const inp = {
      tripId: 'test',
      delay: 10,
      platform: 2,
      provenance: 'origin',
      direction: 'destination',
      line: { name: 'ICE 302' },
    } as unknown as Alternative;

    it('should map arrival correctly', () => {
      const dto = new TimetableEntry(inp, 'arrival');

      expect(dto.tripId).toBe(shaHash(inp.tripId));
      expect(dto.type).toBe('arrival');
      expect(dto.delay).toBe(inp.delay);
      expect(dto.platform).toBe(inp.platform);
      expect(dto.origin).toBe(inp.provenance);
      expect(dto.line).toBe(inp.line?.name);
      expect(dto.lineType).toBe(inp.line?.name?.split(' ')[0]);
    });

    it('should map departure correctly', () => {
      const dto = new TimetableEntry(inp, 'departure');

      expect(dto.tripId).toBe(shaHash(inp.tripId));
      expect(dto.type).toBe('departure');
      expect(dto.delay).toBe(inp.delay);
      expect(dto.platform).toBe(inp.platform);
      expect(dto.destination).toBe(inp.direction);
      expect(dto.line).toBe(inp.line?.name);
      expect(dto.lineType).toBe(inp.line?.name?.split(' ')[0]);
    });
  });

  describe('Station', () => {
    it('should map correctly', () => {
      const inp = {
        id: 'id',
        name: 'name',
      } as VendoStation;

      const dto = new Station(inp);

      expect(dto.id).toBe(inp.id);
      expect(dto.name).toBe(inp.name);
    });
  });
});
