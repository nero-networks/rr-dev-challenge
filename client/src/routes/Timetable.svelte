<script lang="ts">
    import { timetable } from "$lib/data.svelte";
    import type { TimetableEntry } from "$lib/vendo.dto";
    import SvelteTable from "svelte-table";

    const val =
        (key: keyof TimetableEntry, deflt?: string) => (item: TimetableEntry) =>
            item[key]?.toString() || deflt || "";

    const date =
        (key: keyof TimetableEntry, alt: string) => (item: TimetableEntry) =>
            typeof item[key] === "string"
                ? new Date(item[key]).toLocaleTimeString()
                : alt;

    const columns = [
        {
            key: "line",
            title: "Linie",
            value: val("line"),
            class: "max-width-120",
            headerClass: "max-width-120",
        },
        {
            key: "arrival",
            title: "Ankunft",
            value: date("arrival", "beginnt hier"),
            class: (data: TimetableEntry) =>
                !data.arrival
                    ? "text-grey text-center max-width-200"
                    : "text-center max-width-200",
            headerClass: "text-center max-width-200",
        },
        {
            key: "origin",
            title: "von",
            value: val("origin", timetable.station?.name),
            class: "min-width-200",
            headerClass: "min-width-200",
        },
        {
            key: "departure",
            title: "Abfahrt",
            value: date("departure", "---"),
            class: "text-center max-width-200",
            headerClass: "text-center max-width-200",
        },
        {
            key: "platform",
            title: "an Gl./Hst.",
            value: val("platform"),
            class: "text-center",
            headerClass: "text-center",
        },
        {
            key: "destination",
            title: "nach",
            value: (data: TimetableEntry) => data.destination || "endet hier",
            class: (data: TimetableEntry) =>
                !data.departure ? "text-grey min-width-200" : "min-width-200",
            headerClass: "min-width-200",
        },
        {
            key: "delay",
            title: "Verspätung",
            value: (data: TimetableEntry) => {
                const delay = data.delay || 0;
                if (delay < 60) return "pünktlich";
                const minutes = Math.floor(delay / 60);
                return `${minutes} min`;
            },
            class: (data: TimetableEntry) => {
                const delay = data.delay || 0;
                if (delay < 60) return "text-green";
                if (delay < 60 * 6) return "text-orange";
                return "text-red";
            },
        },
    ];

    let rows = $derived.by(() => {
        const checked = timetable.lineTypes
            .filter((t) => t.checked)
            .map((t) => t.name);

        return timetable.rows.filter(
            (row) => row.lineType && checked.includes(row.lineType),
        );
    });
</script>

<div>
    <SvelteTable {columns} {rows} />
</div>
