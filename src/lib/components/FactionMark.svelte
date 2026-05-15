<script lang="ts">
  import FactionMarkInner from './FactionMarkInner.svelte';

  type Props = {
    factionId: string;
    sizeClass?: string;
    label?: string;
  };

  let { factionId, sizeClass = 'h-8 w-8', label }: Props = $props();
</script>

{#key factionId}
  <FactionMarkInner {factionId} {sizeClass} {label} />
{/key}
