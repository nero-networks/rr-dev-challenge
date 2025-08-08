import { env } from "$env/dynamic/public";
import type { Station, TimetableEntry } from "./vendo.dto";

const baseUrl = env['PUBLIC_API_BASE_URL'] || 'http://localhost:3000';

/**
 * 
 * @param query station name or substring of station name
 * @returns a promise for a list of Station objects
 */
export async function findStations(query: string) {
    // TODO reasonable sanitation

    const res = await fetch(`${baseUrl}/stations?query=${encodeURIComponent(query)}`);
    return await res.json() as Station[];
}

/**
 * 
 * @param station station id in IBNR format (e.g. 8000150)
 * @param duration duration of timetable in minutes
 * @returns a promise for a list of TimetableEntry objects
 */
export async function getTimetable(station: string, duration = 60) {
    if (!station?.length) throw new Error('parameter station is required');
    // TODO reasonable validations
    
    const res = await fetch(`${baseUrl}/timetable/${encodeURIComponent(station)}?duration=${duration}`);
    return await res.json() as TimetableEntry[];
}
