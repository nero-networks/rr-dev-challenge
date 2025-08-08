import { getTimetable } from "./api-client";
import type { Station, TimetableEntry } from "./vendo.dto";

export type LineType = NamedItem & { checked: boolean; };

export type Timetable = {
    station?: Station;
    lineTypes: LineType[];
    rows: TimetableEntry[];
};

export const durations = [
    { name: "15 Minuten", value: 15 },
    { name: "30 Minuten", value: 30 },
    { name: "1 Stunde", value: 60 },
    { name: "1 ½ Stunden", value: 90 },
    { name: "2 Stunden", value: 120 },
    { name: "2 ½ Stunden", value: 150 },
    { name: "3 Stunden", value: 180 },
];

// this exports the latest timetable data as a reactive state
// it can be imported anywhere and used with other runes like $derived or $effect
export const timetable: Timetable = $state<Timetable>({
    lineTypes: [], rows: []
});

// this holds the runtime state of excluded line types
// it gets updated according to the state of the line type checkboxes
let _unchecked = ['S', 'U', 'STR', 'BUS'];
function uncheckedLineTypes() {
    timetable.lineTypes.forEach(t => {
        if (t.checked && _unchecked.includes(t.name)) _unchecked = _unchecked.filter(s => s !== t.name);
        if (!t.checked && !_unchecked.includes(t.name)) _unchecked.push(t.name);
    });
    return _unchecked;
};

/**
 * calling this function will update the exported timetable state variable
 * in addition it returns a promise which resolves with the updated timetable
 * 
 * @param station station id in IBNR format (e.g. 8000150)
 * @param duration duration of timetable in minutes
 * @returns a promise for a list of TimetableEntry objects
 */
export function loadTimetable(station: Station, duration: number) {
    return new Promise<Timetable>(async (resolve, reject) => {
        try {
            const data = await getTimetable(station.id, duration);
            timetable.rows = data;
            timetable.station = station;

            const unchecked = uncheckedLineTypes();
            const types = [...new Set(data.map(r => r.lineType || '').filter(t => t))];
            timetable.lineTypes = types
                .map(name => name.toUpperCase())
                .map(name => ({ name, checked: !unchecked.includes(name) }));

            resolve(timetable);
        } catch (err) { reject(err); }
    });
}
