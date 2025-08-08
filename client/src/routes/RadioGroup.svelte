<script lang="ts">
    import { randId } from "$lib/tools";
    console.log(randId());
    type Props<T extends NamedItem> = {
        items: T[];
        value: T;
        name?: string;
        title?: string;
    };
    let {
        items = [],
        value = $bindable(),
        name,
        title,
    }: Props<NamedItem> = $props();
</script>

<fieldset>
    {#if title}<legend>{title}</legend>{/if}
    {#each items as item, i}
        <label
            ><input
                type="radio"
                name={name || randId()}
                value={item}
                onchange={() => (value = item)}
                checked={item.name === value?.name}
            />{item.name}</label
        >
    {/each}
</fieldset>
