import { FACTION_ICONS, SPEARHEAD_FACTIONS } from '$lib/constants';

export type SpearheadFactionId = (typeof SPEARHEAD_FACTIONS)[number]['id'];

const ID_SET = new Set<string>(SPEARHEAD_FACTIONS.map((f) => f.id));

export function isSpearheadFactionId(v: string): v is SpearheadFactionId {
  return ID_SET.has(v);
}

export function getSpearheadFaction(
  id: string
): (typeof SPEARHEAD_FACTIONS)[number] | undefined {
  return SPEARHEAD_FACTIONS.find((f) => f.id === id);
}

export function spearheadFactionIconUrl(id: string): string {
  return getSpearheadFaction(id)?.iconUrl ?? FACTION_ICONS.defaultUrl;
}

export { FACTION_ICONS, SPEARHEAD_FACTIONS };
