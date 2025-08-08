<script lang="ts">
    import { onMount } from "svelte";

    type OptionsProps<T extends NamedItem> = {
        delay?: number;
        value: T | undefined;
        placeholder?: string;
        getOptions: (query: string) => Promise<T[]>;
    };
    let {
        delay = 200,
        value = $bindable(),
        getOptions,
        placeholder = "",
    }: OptionsProps<NamedItem> = $props();

    let query = $state<string>("");
    let selected = $state(-1);
    let options = $state<NamedItem[]>();
    let hideSearch = $state(false);

    let container: HTMLElement;

    onMount(async () => {
        if (query.length > 2) {
            options = await getOptions(query);
            selected = options.findIndex((s) => s.name === query);
            if (selected !== -1) setValue(options[selected]);
        }
        document.body.onclick = (e: PointerEvent) => {
            if (!hideSearch) hideSearch = !container.contains(e.target as Node);
        };
    });

    function loadOptions() {
        if (query.length > 2)
            getOptions(query).then((res) => {
                options = res;
                hideSearch = false;
            });
    }

    function checkKey(e: KeyboardEvent) {
        if (!options?.length) return;
        switch (e.code) {
            case "ArrowDown":
                if (++selected >= options.length) selected = 0;
                break;

            case "ArrowUp":
                if (--selected < 0) selected = options.length - 1;
                break;

            case "Enter":
                setValue(options[selected]);
                break;

            case "Backspace":
            case "Delete":
                checkSearch(e);
                break;
        }
    }

    let timeout: number;
    function checkSearch(e: KeyboardEvent) {
        if (e.code === "Enter") return;

        // debounce the request to allow the user to type more then one letter
        // checking query.length for desired length -1 because the pressed char
        // is appended to query after this handler. the minimum is 3 chars
        if (timeout) clearTimeout(timeout);
        if (query.length >= 2) timeout = setTimeout(loadOptions, delay);
    }

    function checkClear() {
        if (!query) {
            value = undefined;
            options = undefined;
            selected = -1;
        }
    }

    function setValue(v: any) {
        value = v;
        query = v.name;
        hideSearch = true;
        selected = -1;
    }
</script>

<div class="box" bind:this={container}>
    <input
        bind:value={query}
        onkeydown={checkKey}
        onkeypress={checkSearch}
        onkeyup={checkClear}
        onfocus={() => !hideSearch && (hideSearch = false)}
        onclick={() => (hideSearch = !hideSearch)}
        {placeholder}
    />

    {#if options && !hideSearch}
        {#if !options.length}
            Kein Ergebnis
        {:else}
            <ul>
                {#each options as station, index}
                    <li>
                        <button
                            onclick={() => setValue(station)}
                            class={index === selected ? "selected" : ""}
                            >{station.name}</button
                        >
                    </li>
                {/each}
            </ul>
        {/if}
    {/if}
</div>

<style>
    .box {
        position: relative;
        display: inline-block;
    }

    input {
        width: 40vh;
    }

    ul {
        position: absolute;
        background-color: #f1f1f1;
        overflow: auto;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        padding: 0;
        width: 97%;
    }

    ul button {
        background-color: transparent;
        font-weight: bold;
        margin: 0;
        width: 100%;
        text-align: start;
        outline: none;
    }
    ul button:focus,
    ul button.selected {
        background-color: #c5c5c5;
    }
</style>
