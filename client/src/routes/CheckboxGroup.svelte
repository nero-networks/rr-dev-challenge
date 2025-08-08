<script lang="ts">
    type Box = NamedItem & { checked: boolean };
    type Props<T extends Box[]> = {
        values: T;
        title?: string;
    };

    let { values = $bindable(), title }: Props<Box[]> = $props();

    $effect(() => {
        if (values)
            values.sort((a: Box, b: Box) => {
                if ((a.checked && b.checked) || (!a.checked && !b.checked))
                    return a.name > b.name ? 1 : -1;
                return !a.checked ? 1 : -1;
            });
    });
</script>

<fieldset>
    {#if title}<legend>{title}</legend>{/if}
    {#each values as box, i}
        <label class={!box.checked ? "text-grey" : ""}
            ><input
                type="checkbox"
                onchange={(e: any) => (box.checked = e.target?.checked)}
                checked={box.checked}
            />{box.name}</label
        >
    {/each}
</fieldset>
