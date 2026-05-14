<script lang="ts">
  export let data: any;
  export let form: any;

  $: league = data.league;
  $: players = data.players;
  $: matches = data.matches;
  $: stats = data.stats;
  $: standings = data.standings;

  function statusBadge(s: string) {
    if (s === 'active') return 'border-emerald-800 bg-emerald-950/50 text-emerald-200';
    if (s === 'finished') return 'border-zinc-700 bg-zinc-900 text-zinc-300';
    return 'border-amber-900 bg-amber-950/50 text-amber-200';
  }

  function resultLabel(m: any): string {
    if (!m.result) return 'open';
    if (m.result === 'draw') return 'draw';
    if (m.result === 'a') return `${m.playerAName} won`;
    return `${m.playerBName} won`;
  }

  function fmtPoints(n: number): string {
    return Number.isInteger(n) ? String(n) : n.toFixed(1);
  }
</script>

<main class="min-h-dvh bg-zinc-950 text-zinc-50">
  <div class="mx-auto flex max-w-5xl flex-col gap-6 p-6">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-semibold tracking-tight">{league.name}</h1>
        <div class="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span class="font-mono">/l/{league.slug}</span>
          <span>·</span>
          <span class={`rounded-full border px-2 py-0.5 ${statusBadge(league.status)}`}>{league.status}</span>
          <span>·</span>
          <a class="underline hover:text-zinc-200" href={`/l/${league.slug}`}>Public page</a>
          <span>·</span>
          <a class="underline hover:text-zinc-200" href="/admin">Back to admin</a>
        </div>
      </div>
      <div class="flex items-center gap-2">
        {#if league.status === 'draft'}
          <form method="POST" action="?/startLeague">
            <button class="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500" type="submit">
              Start league
            </button>
          </form>
        {/if}
        {#if league.status === 'active'}
          <form method="POST" action="?/finish">
            <button class="rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-2 text-sm hover:bg-zinc-900/60" type="submit">
              Mark finished
            </button>
          </form>
        {/if}
        {#if league.status === 'finished'}
          <form method="POST" action="?/reopen">
            <button class="rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-2 text-sm hover:bg-zinc-900/60" type="submit">
              Reopen
            </button>
          </form>
        {/if}
      </div>
    </header>

    {#if form?.error}
      <div class="rounded-xl border border-red-900/60 bg-red-950/40 p-3 text-sm text-red-200">
        {form.error}
      </div>
    {/if}

    <section class="rounded-xl border border-zinc-800 bg-zinc-900/40">
      <div class="flex items-center justify-between border-b border-zinc-800 p-4">
        <h2 class="text-sm font-medium text-zinc-200">Players ({players.length})</h2>
        <span class="text-xs text-zinc-500">
          {stats.completed}/{stats.total} matches recorded
        </span>
      </div>

      {#if league.status === 'draft'}
        <form method="POST" action="?/addPlayer" class="flex items-center gap-2 border-b border-zinc-800 p-3">
          <input
            class="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
            name="name"
            required
            placeholder="Add player by name"
          />
          <button class="rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-2 text-sm hover:bg-zinc-900/60" type="submit">
            Add
          </button>
        </form>
      {/if}

      <ul class="divide-y divide-zinc-800">
        {#each players as p (p.id)}
          <li class="flex items-center justify-between gap-3 p-3">
            <div class="font-medium">{p.name}</div>
            {#if league.status === 'draft'}
              <form method="POST" action="?/removePlayer">
                <input type="hidden" name="playerId" value={p.id} />
                <button
                  class="rounded-lg border border-zinc-800 bg-zinc-900/40 px-2 py-1 text-xs text-zinc-300 hover:bg-red-950/60 hover:text-red-200"
                  type="submit"
                >
                  Remove
                </button>
              </form>
            {/if}
          </li>
        {:else}
          <li class="p-3 text-sm text-zinc-300">No players yet.</li>
        {/each}
      </ul>

      {#if league.status !== 'draft'}
        <div class="border-t border-zinc-800 p-3">
          <form method="POST" action="?/resetSchedule">
            <button
              class="rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs text-zinc-300 hover:bg-red-950/60 hover:text-red-200"
              type="submit"
              onclick={(e) => {
                if (!confirm('This deletes all recorded results and returns the league to draft. Continue?')) e.preventDefault();
              }}
            >
              Reset schedule (back to draft)
            </button>
          </form>
        </div>
      {/if}
    </section>

    {#if matches.length > 0}
      <section class="rounded-xl border border-zinc-800 bg-zinc-900/40">
        <div class="border-b border-zinc-800 p-4">
          <h2 class="text-sm font-medium text-zinc-200">Matches</h2>
        </div>
        <ul class="divide-y divide-zinc-800">
          {#each matches as m (m.id)}
            <li class="flex flex-wrap items-center justify-between gap-3 p-3">
              <div class="flex flex-col gap-1">
                <div class="text-sm">
                  <span class="font-medium">{m.playerAName}</span>
                  <span class="text-zinc-500">vs</span>
                  <span class="font-medium">{m.playerBName}</span>
                </div>
                <div class="text-xs text-zinc-400">{resultLabel(m)}</div>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <form method="POST" action="?/recordResult" class="flex items-center gap-2">
                  <input type="hidden" name="matchId" value={m.id} />
                  <button
                    type="submit"
                    name="result"
                    value="a"
                    class={`rounded-lg border px-2 py-1 text-xs ${m.result === 'a' ? 'border-emerald-700 bg-emerald-950/60 text-emerald-200' : 'border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/60'}`}
                  >
                    {m.playerAName} wins
                  </button>
                  <button
                    type="submit"
                    name="result"
                    value="draw"
                    class={`rounded-lg border px-2 py-1 text-xs ${m.result === 'draw' ? 'border-amber-800 bg-amber-950/60 text-amber-200' : 'border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/60'}`}
                  >
                    Draw
                  </button>
                  <button
                    type="submit"
                    name="result"
                    value="b"
                    class={`rounded-lg border px-2 py-1 text-xs ${m.result === 'b' ? 'border-emerald-700 bg-emerald-950/60 text-emerald-200' : 'border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/60'}`}
                  >
                    {m.playerBName} wins
                  </button>
                </form>
                {#if m.result}
                  <form method="POST" action="?/clearResult">
                    <input type="hidden" name="matchId" value={m.id} />
                    <button
                      class="rounded-lg border border-zinc-800 bg-zinc-900/40 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-900/60"
                      type="submit"
                    >
                      Clear
                    </button>
                  </form>
                {/if}
              </div>
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if standings.length > 0}
      <section class="rounded-xl border border-zinc-800 bg-zinc-900/40">
        <div class="border-b border-zinc-800 p-4">
          <h2 class="text-sm font-medium text-zinc-200">Standings preview</h2>
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
              {/each}
            </tbody>
          </table>
        </div>
      </section>
    {/if}

    <section class="rounded-xl border border-red-900/40 bg-red-950/10 p-4">
      <h2 class="mb-2 text-sm font-medium text-red-300">Danger zone</h2>
      <form method="POST" action="?/delete">
        <button
          class="rounded-lg border border-red-900 bg-red-950/40 px-3 py-2 text-xs text-red-200 hover:bg-red-950/60"
          type="submit"
          onclick={(e) => {
            if (!confirm('Delete this league and all its data? This cannot be undone.')) e.preventDefault();
          }}
        >
          Delete league
        </button>
      </form>
    </section>
  </div>
</main>
