<script lang="ts">
  import { initials } from '$lib/leagueCardAccent';
  import { FACTION_ICONS, getSpearheadFaction, spearheadFactionIconUrl } from '$lib/factions';

  type Props = {
    factionId: string;
    sizeClass?: string;
    label?: string;
  };

  let { factionId, sizeClass = 'h-8 w-8', label }: Props = $props();

  /** Try faction PNG, then bundled default SVG, then initials. */
  let source = $state<'faction' | 'default' | 'text'>('faction');

  const faction = $derived(getSpearheadFaction(factionId));
  const displayLabel = $derived(label ?? faction?.name ?? factionId);
  const fallbackText = $derived(faction ? initials(faction.name) : '?');

  const imgClass = $derived(
    `shrink-0 rounded-lg border border-zinc-700/60 bg-zinc-900 object-contain object-center ring-1 ring-inset ring-white/5 ${sizeClass}`
  );
</script>

{#if source === 'faction'}
  <img
    src={spearheadFactionIconUrl(factionId)}
    alt=""
    class={imgClass}
    onerror={() => {
      source = 'default';
    }}
  />
{:else if source === 'default'}
  <img
    src={FACTION_ICONS.defaultUrl}
    alt=""
    title={displayLabel}
    class={imgClass}
    onerror={() => {
      source = 'text';
    }}
  />
{:else}
  <span
    class={`flex shrink-0 items-center justify-center rounded-lg border border-zinc-700/60 bg-zinc-800/90 text-[10px] font-semibold uppercase tracking-wide text-zinc-300 ring-1 ring-inset ring-white/5 ${sizeClass}`}
    title={displayLabel}
    aria-hidden="true"
  >
    {fallbackText}
  </span>
{/if}
