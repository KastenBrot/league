<script lang="ts">
  import FactionMark from '$lib/components/FactionMark.svelte';

  export let data: any;

  $: league = data.league;
  $: standings = data.standings;
  $: recent = data.recent;
  $: stats = data.stats;
  $: openMatchesPerPlayer = data.openMatchesPerPlayer;

  function statusBadge(s: string) {
    if (s === 'active') return 'border-emerald-500/35 bg-emerald-950/50 text-emerald-200';
    return 'border-zinc-600/50 bg-zinc-800/60 text-zinc-300';
  }

  function fmtPoints(n: number): string {
    return Number.isInteger(n) ? String(n) : n.toFixed(1);
  }

  function resultLabel(m: any): string {
    if (m.result === 'draw') return 'Draw';
    if (m.result === 'a') return `${m.playerAName} won`;
    return `${m.playerBName} won`;
  }

  $: podium = standings.slice(0, 3);
</script>

<main class="relative z-10 min-h-dvh text-zinc-50">
  <div class="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-10 sm:px-8 sm:py-12">
    <header class="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-xl shadow-black/25 ring-1 ring-inset ring-white/5 backdrop-blur-md sm:p-8">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-3">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-teal-400/90">League</p>
          <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">{league.name}</h1>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-500">
            <span class={`rounded-full border px-2.5 py-1 font-medium uppercase tracking-wide ${statusBadge(league.status)}`}>
              {league.status}
            </span>
            <span class="hidden sm:inline text-zinc-700">|</span>
            <span class="tabular-nums">{stats.completed}/{stats.total} matches played</span>
          </div>
        </div>
        <a
          class="inline-flex items-center gap-2 self-start rounded-xl border border-zinc-700/80 bg-zinc-950/50 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900/60"
          href="/"
        >
          <span aria-hidden="true" class="text-zinc-500">←</span>
          All leagues
        </a>
      </div>
    </header>

    {#if standings.length > 0}
      <section class="rounded-2xl border border-zinc-800/80 bg-zinc-900/35 p-5 shadow-lg shadow-black/20 ring-1 ring-inset ring-white/5 backdrop-blur-md sm:p-6">
        <div class="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="text-sm font-semibold text-zinc-100">Top of the table</h2>
            <p class="text-xs text-zinc-500">By points — full grid below.</p>
          </div>
        </div>
        <div
          class={`flex items-end ${standings.length >= 3 ? 'justify-center gap-3 sm:gap-4' : standings.length === 2 ? 'justify-center gap-6 sm:gap-10' : 'justify-center'}`}
        >
          {#if podium[1]}
            <div class="flex w-full max-w-[7.5rem] flex-col items-center text-center">
              <div class="mb-3">
                <FactionMark factionId={podium[1].factionId} sizeClass="h-12 w-12" />
              </div>
              <div
                class="flex w-full flex-col justify-end rounded-t-xl border border-b-0 border-zinc-700/80 bg-gradient-to-b from-zinc-800/50 to-zinc-950/60 px-2 pb-3 pt-4 ring-1 ring-inset ring-white/5"
                style="min-height: 5.5rem"
              >
                <p class="truncate text-xs font-medium text-zinc-200">{podium[1].playerName}</p>
                <p class="mt-1 text-lg font-semibold tabular-nums text-zinc-100">{fmtPoints(podium[1].points)}</p>
                <p class="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">2nd</p>
              </div>
            </div>
          {:else if standings.length >= 3}
            <div class="hidden w-full max-w-[7.5rem] sm:block" aria-hidden="true"></div>
          {/if}

          {#if podium[0]}
            <div class="flex w-full max-w-[9rem] flex-col items-center text-center">
              <div class="mb-3">
                <FactionMark factionId={podium[0].factionId} sizeClass="h-14 w-14" />
              </div>
              <div
                class="flex w-full flex-col justify-end rounded-t-xl border border-b-0 border-amber-900/40 bg-gradient-to-b from-amber-950/35 to-zinc-950/80 px-3 pb-4 pt-6 ring-1 ring-inset ring-amber-500/15"
                style="min-height: {standings.length === 1 ? '6rem' : '7.5rem'}"
              >
                <p class="truncate text-sm font-semibold text-zinc-50">{podium[0].playerName}</p>
                <p class="mt-1 text-2xl font-semibold tabular-nums text-white">{fmtPoints(podium[0].points)}</p>
                <p class="text-[10px] font-semibold uppercase tracking-wider text-amber-200/80">1st</p>
              </div>
            </div>
          {/if}

          {#if podium[2]}
            <div class="flex w-full max-w-[7.5rem] flex-col items-center text-center">
              <div class="mb-3">
                <FactionMark factionId={podium[2].factionId} sizeClass="h-12 w-12" />
              </div>
              <div
                class="flex w-full flex-col justify-end rounded-t-xl border border-b-0 border-zinc-700/80 bg-gradient-to-b from-zinc-800/40 to-zinc-950/60 px-2 pb-3 pt-3 ring-1 ring-inset ring-white/5"
                style="min-height: 4.5rem"
              >
                <p class="truncate text-xs font-medium text-zinc-200">{podium[2].playerName}</p>
                <p class="mt-1 text-lg font-semibold tabular-nums text-zinc-100">{fmtPoints(podium[2].points)}</p>
                <p class="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">3rd</p>
              </div>
            </div>
          {:else if standings.length >= 3}
            <div class="hidden w-full max-w-[7.5rem] sm:block" aria-hidden="true"></div>
          {/if}
        </div>
      </section>
    {/if}

    <section class="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/35 shadow-lg shadow-black/20 ring-1 ring-inset ring-white/5 backdrop-blur-md">
      <div class="border-b border-zinc-800/80 bg-zinc-950/30 px-5 py-4 sm:px-6">
        <h2 class="text-sm font-semibold text-zinc-100">Standings</h2>
        <p class="mt-1 text-xs text-zinc-500">Win = 1, draw = 0.5, loss = 0.</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            <tr class="border-b border-zinc-800/80">
              <th class="px-5 py-3 sm:px-6">#</th>
              <th class="px-5 py-3 sm:px-6">Player</th>
              <th class="px-5 py-3 text-right sm:px-6">P</th>
              <th class="px-5 py-3 text-right sm:px-6">W</th>
              <th class="px-5 py-3 text-right sm:px-6">D</th>
              <th class="px-5 py-3 text-right sm:px-6">L</th>
              <th class="px-5 py-3 text-right sm:px-6">Pts</th>
            </tr>
          </thead>
          <tbody>
            {#each standings as row, i (row.playerId)}
              <tr
                class={`border-b border-zinc-800/50 transition hover:bg-zinc-800/25 ${i === 0 ? 'bg-teal-950/15' : i % 2 === 1 ? 'bg-zinc-950/20' : ''}`}
              >
                <td class="px-5 py-3 tabular-nums text-zinc-500 sm:px-6">{i + 1}</td>
                <td class="px-5 py-3 sm:px-6">
                  <div class="flex items-center gap-2">
                    <FactionMark factionId={row.factionId} sizeClass="h-8 w-8" />
                    <span class="font-medium text-zinc-100">{row.playerName}</span>
                  </div>
                </td>
                <td class="px-5 py-3 text-right font-mono text-zinc-400 sm:px-6">{row.played}</td>
                <td class="px-5 py-3 text-right font-mono text-zinc-400 sm:px-6">{row.wins}</td>
                <td class="px-5 py-3 text-right font-mono text-zinc-400 sm:px-6">{row.draws}</td>
                <td class="px-5 py-3 text-right font-mono text-zinc-400 sm:px-6">{row.losses}</td>
                <td class="px-5 py-3 text-right font-mono text-sm font-semibold text-zinc-50 sm:px-6">
                  {fmtPoints(row.points)}
                </td>
              </tr>
            {:else}
              <tr>
                <td class="px-5 py-8 text-sm text-zinc-400 sm:px-6" colspan="7">No players yet.</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>

    <section class="rounded-2xl border border-zinc-800/80 bg-zinc-900/35 shadow-lg shadow-black/20 ring-1 ring-inset ring-white/5 backdrop-blur-md">
      <div class="border-b border-zinc-800/80 bg-zinc-950/30 px-5 py-4 sm:px-6">
        <h2 class="text-sm font-semibold text-zinc-100">Open matches</h2>
        <p class="mt-1 text-xs text-zinc-500">Who each player still needs to play.</p>
      </div>
      <ul class="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
        {#each openMatchesPerPlayer as row (row.playerId)}
          <li class="flex flex-col rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-4 ring-1 ring-inset ring-white/5">
            <div class="flex items-start justify-between gap-2">
              <div class="flex min-w-0 items-center gap-2">
                <FactionMark factionId={row.factionId} sizeClass="h-8 w-8 shrink-0" />
                <span class="font-medium text-zinc-100">{row.playerName}</span>
              </div>
              <span class="shrink-0 rounded-full bg-zinc-800/80 px-2 py-0.5 text-[11px] font-medium tabular-nums text-zinc-400">
                {row.opponents.length} open
              </span>
            </div>
            {#if row.opponents.length > 0}
              <div class="mt-3 flex flex-wrap gap-1.5">
                {#each row.opponents as op (op.id)}
                  <span
                    class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/60 bg-zinc-900/60 py-1 pl-1 pr-2 text-xs text-zinc-300 ring-1 ring-inset ring-white/5"
                  >
                    <FactionMark factionId={op.factionId} sizeClass="h-5 w-5" />
                    {op.name}
                  </span>
                {/each}
              </div>
            {:else}
              <p class="mt-3 text-xs font-medium text-emerald-400/90">All matches played.</p>
            {/if}
          </li>
        {:else}
          <li class="col-span-full rounded-xl border border-dashed border-zinc-700/60 p-6 text-center text-sm text-zinc-400">
            No players in this league.
          </li>
        {/each}
      </ul>
    </section>

    <section class="rounded-2xl border border-zinc-800/80 bg-zinc-900/35 shadow-lg shadow-black/20 ring-1 ring-inset ring-white/5 backdrop-blur-md">
      <div class="border-b border-zinc-800/80 bg-zinc-950/30 px-5 py-4 sm:px-6">
        <h2 class="text-sm font-semibold text-zinc-100">Recent results</h2>
      </div>
      <ul class="divide-y divide-zinc-800/60">
        {#each recent as m (m.id)}
          <li class="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
              <span class="inline-flex items-center gap-1.5 font-medium text-zinc-100">
                <FactionMark factionId={m.playerAFactionId} sizeClass="h-6 w-6 shrink-0" />
                {m.playerAName}
              </span>
              <span class="text-xs font-semibold uppercase tracking-wider text-zinc-600">vs</span>
              <span class="inline-flex items-center gap-1.5 font-medium text-zinc-100">
                <FactionMark factionId={m.playerBFactionId} sizeClass="h-6 w-6 shrink-0" />
                {m.playerBName}
              </span>
              <span class="ml-0 text-zinc-500 sm:ml-2">—</span>
              <span class="text-zinc-400">{resultLabel(m)}</span>
            </div>
            {#if m.recordedAt}
              <time class="text-xs tabular-nums text-zinc-500">{new Date(m.recordedAt).toLocaleString()}</time>
            {/if}
          </li>
        {:else}
          <li class="px-5 py-8 text-sm text-zinc-400 sm:px-6">No results yet.</li>
        {/each}
      </ul>
    </section>
  </div>
</main>
