<script lang="ts">
  export let data: any;

  $: league = data.league;
  $: standings = data.standings;
  $: recent = data.recent;
  $: stats = data.stats;
  $: openMatchesPerPlayer = data.openMatchesPerPlayer;

  function statusBadge(s: string) {
    if (s === 'active') return 'border-emerald-800 bg-emerald-950/50 text-emerald-200';
    return 'border-zinc-700 bg-zinc-900 text-zinc-300';
  }

  function fmtPoints(n: number): string {
    return Number.isInteger(n) ? String(n) : n.toFixed(1);
  }

  function resultLabel(m: any): string {
    if (m.result === 'draw') return 'draw';
    if (m.result === 'a') return `${m.playerAName} won`;
    return `${m.playerBName} won`;
  }
</script>

<main class="min-h-dvh bg-zinc-950 text-zinc-50">
  <div class="mx-auto flex max-w-3xl flex-col gap-6 p-6">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-semibold tracking-tight">{league.name}</h1>
        <div class="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span class={`rounded-full border px-2 py-0.5 ${statusBadge(league.status)}`}>{league.status}</span>
          <span>·</span>
          <span>{stats.completed}/{stats.total} matches played</span>
          <span>·</span>
          <a class="underline hover:text-zinc-200" href="/">All leagues</a>
        </div>
      </div>
    </header>

    <section class="rounded-xl border border-zinc-800 bg-zinc-900/40">
      <div class="border-b border-zinc-800 p-4">
        <h2 class="text-sm font-medium text-zinc-200">Standings</h2>
        <p class="mt-1 text-xs text-zinc-500">Win = 1, Draw = 0.5, Loss = 0</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="text-left text-xs uppercase tracking-wide text-zinc-400">
            <tr>
              <th class="px-4 py-2">#</th>
              <th class="px-4 py-2">Player</th>
              <th class="px-4 py-2 text-right">P</th>
              <th class="px-4 py-2 text-right">W</th>
              <th class="px-4 py-2 text-right">D</th>
              <th class="px-4 py-2 text-right">L</th>
              <th class="px-4 py-2 text-right">Pts</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800">
            {#each standings as row, i (row.playerId)}
              <tr>
                <td class="px-4 py-2 text-zinc-500">{i + 1}</td>
                <td class="px-4 py-2 font-medium">{row.playerName}</td>
                <td class="px-4 py-2 text-right font-mono">{row.played}</td>
                <td class="px-4 py-2 text-right font-mono">{row.wins}</td>
                <td class="px-4 py-2 text-right font-mono">{row.draws}</td>
                <td class="px-4 py-2 text-right font-mono">{row.losses}</td>
                <td class="px-4 py-2 text-right font-mono font-semibold">{fmtPoints(row.points)}</td>
              </tr>
            {:else}
              <tr>
                <td class="px-4 py-3 text-sm text-zinc-300" colspan="7">No players yet.</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>

    <section class="rounded-xl border border-zinc-800 bg-zinc-900/40">
      <div class="border-b border-zinc-800 p-4">
        <h2 class="text-sm font-medium text-zinc-200">Open matches</h2>
        <p class="mt-1 text-xs text-zinc-500">Opponents each player still needs to face.</p>
      </div>
      <ul class="divide-y divide-zinc-800">
        {#each openMatchesPerPlayer as row (row.playerId)}
          <li class="p-4">
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <div class="font-medium">{row.playerName}</div>
              <div class="text-xs text-zinc-500">{row.opponents.length} open</div>
            </div>
            {#if row.opponents.length > 0}
              <div class="mt-2 flex flex-wrap gap-1.5">
                {#each row.opponents as op (op.id)}
                  <span class="rounded-full border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-xs text-zinc-300">{op.name}</span>
                {/each}
              </div>
            {:else}
              <div class="mt-1 text-xs text-emerald-300">All matches played.</div>
            {/if}
          </li>
        {:else}
          <li class="p-4 text-sm text-zinc-300">No players in this league.</li>
        {/each}
      </ul>
    </section>

    <section class="rounded-xl border border-zinc-800 bg-zinc-900/40">
      <div class="border-b border-zinc-800 p-4">
        <h2 class="text-sm font-medium text-zinc-200">Recent results</h2>
      </div>
      <ul class="divide-y divide-zinc-800">
        {#each recent as m (m.id)}
          <li class="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
            <div>
              <span class="font-medium">{m.playerAName}</span>
              <span class="text-zinc-500">vs</span>
              <span class="font-medium">{m.playerBName}</span>
              <span class="ml-2 text-zinc-400">— {resultLabel(m)}</span>
            </div>
            {#if m.recordedAt}
              <span class="text-xs text-zinc-500">{new Date(m.recordedAt).toLocaleString()}</span>
            {/if}
          </li>
        {:else}
          <li class="p-4 text-sm text-zinc-300">No results yet.</li>
        {/each}
      </ul>
    </section>
  </div>
</main>
