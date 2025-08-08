<script lang="ts">
    import { findStations } from "$lib/api-client";
    import { durations, loadTimetable, timetable } from "$lib/data.svelte";
    import type { Station } from "$lib/vendo.dto";
    import CheckboxGroup from "./CheckboxGroup.svelte";
    import Options from "./Options.svelte";
    import RadioGroup from "./RadioGroup.svelte";
    import Timetable from "./Timetable.svelte";

    let showFilters = $state(false);

    let station = $state<Station>();
    let duration = $state(durations[1]); // defaults to 30 minutes

    let refresh = $state(1); // reactive trigger to refresh if incremented
    let loading = $derived(
        station && refresh && loadTimetable(station, duration.value),
    );
</script>

<h1>Fahrplan{station ? ` für ${station.name}` : ""}</h1>

<div class="filters">
    <Options
        bind:value={station}
        getOptions={findStations}
        placeholder="Bahnhof / Haltestelle wählen"
    />
    <button disabled={!station} onclick={() => ++refresh || ++refresh}
        >Aktualisieren</button
    >
    <button
        class="right"
        disabled={!station}
        onclick={() => (showFilters = !showFilters)}
        >{showFilters ? "Filter ausblenden" : "Anzeige anpassen"}</button
    >
</div>

{#if showFilters}
    <div>
        <RadioGroup
            bind:value={duration}
            items={durations}
            title="angezeigter Zeitraum"
        />
        <CheckboxGroup
            bind:values={timetable.lineTypes}
            title="ausgewählte Verkehrsmittel"
        />
    </div>
{/if}

{#if loading}
    {#await loading}
        <div>Die Daten werden geladen</div>
    {:then}
        <Timetable />
    {/await}
{/if}

<style>
    button.right {
        position: absolute;
        right: 0;
    }
</style>
