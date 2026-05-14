<script lang="ts">
  export let data: any;

  function statusBadge(s: string) {
    if (s === 'active') return 'border-emerald-800 bg-emerald-950/50 text-emerald-200';
    if (s === 'finished') return 'border-zinc-700 bg-zinc-900 text-zinc-300';
    return 'border-amber-900 bg-amber-950/50 text-amber-200';
  }

  function pct(c: number, t: number) {
    if (!t) return 0;
    return Math.round((c / t) * 100);
  }
</script>

<main class="min-h-dvh bg-zinc-950 text-zinc-50">
  <div class="mx-auto flex max-w-4xl flex-col gap-6 p-6">
    <header class="flex items-center justify-between gap-3">
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-semibold tracking-tight">Admin</h1>
        <p class="text-sm text-zinc-300">
          Signed in as <span class="font-medium">{data.user?.username}</span>.
          <a class="ml-2 underline hover:text-zinc-100" href="/">Public site</a>
          <a class="ml-2 underline hover:text-zinc-100" href="/logout">Logout</a>
        </p>
      </div>
      <a
        class="rounded-lg bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-white"
        href="/admin/leagues/new"
      >
        New league
      </a>
    </header>

    <section class="rounded-xl border border-zinc-800 bg-zinc-900/40">
      <div class="border-b border-zinc-800 p-4">
        <h2 class="text-sm font-medium text-zinc-200">Leagues</h2>
      </div>
      <ul class="divide-y divide-zinc-800">
        {#each data.leagues as l (l.id)}
          <li class="p-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex flex-col gap-1">
                <a class="font-medium hover:underline" href={`/admin/leagues/${l.slug}`}>{l.name}</a>
                <div class="text-xs text-zinc-400">
                  <span class="font-mono">/l/{l.slug}</span>
                  <span class="ml-2">·</span>
                  <span class="ml-2">{l.playerCount} players</span>
                  <span class="ml-2">·</span>
                  <span class="ml-2">{l.matchCompleted}/{l.matchTotal} matches ({pct(l.matchCompleted, l.matchTotal)}%)</span>
                </div>
              </div>
              <span class={`rounded-full border px-2 py-1 text-xs ${statusBadge(l.status)}`}>
                {l.status}
              </span>
            </div>
          </li>
        {:else}
          <li class="p-4 text-sm text-zinc-300">No leagues yet. Create one to get started.</li>
        {/each}
      </ul>
    </section>
  </div>
</main>
