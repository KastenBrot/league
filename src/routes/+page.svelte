<script lang="ts">
  export let data: any;

  function statusBadge(s: string) {
    if (s === 'active') return 'border-emerald-800 bg-emerald-950/50 text-emerald-200';
    return 'border-zinc-700 bg-zinc-900 text-zinc-300';
  }

  function pct(c: number, t: number) {
    if (!t) return 0;
    return Math.round((c / t) * 100);
  }
</script>

<main class="min-h-dvh bg-zinc-950 text-zinc-50">
  <div class="mx-auto flex max-w-3xl flex-col gap-6 p-6">
    <header class="flex items-center justify-between gap-3">
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-semibold tracking-tight">Leagues</h1>
        <p class="text-sm text-zinc-300">Pick a league to view standings and remaining matches.</p>
      </div>
      <a
        class="rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-2 text-sm hover:bg-zinc-900/60"
        href={data.user ? '/admin' : '/login'}
      >
        {data.user ? 'Admin' : 'Admin login'}
      </a>
    </header>

    <section class="rounded-xl border border-zinc-800 bg-zinc-900/40">
      <ul class="divide-y divide-zinc-800">
        {#each data.leagues as l (l.id)}
          <li>
            <a class="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-zinc-900/60" href={`/l/${l.slug}`}>
              <div class="flex flex-col gap-1">
                <div class="font-medium">{l.name}</div>
                <div class="text-xs text-zinc-400">
                  <span>{l.playerCount} players</span>
                  <span class="mx-1">·</span>
                  <span>{l.matchCompleted}/{l.matchTotal} matches ({pct(l.matchCompleted, l.matchTotal)}%)</span>
                </div>
              </div>
              <span class={`rounded-full border px-2 py-1 text-xs ${statusBadge(l.status)}`}>{l.status}</span>
            </a>
          </li>
        {:else}
          <li class="p-4 text-sm text-zinc-300">No public leagues yet.</li>
        {/each}
      </ul>
    </section>
  </div>
</main>
