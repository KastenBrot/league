<script lang="ts">
  export let form: any;
</script>

<main class="relative z-10 min-h-dvh text-zinc-50">
  <div class="mx-auto flex max-w-lg flex-col gap-8 px-5 py-12 sm:px-8">
    <header class="space-y-2">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/90">Create</p>
      <h1 class="text-3xl font-semibold tracking-tight">New league</h1>
      <p class="text-sm text-zinc-400">
        <a class="text-teal-400/90 underline-offset-4 hover:text-teal-300 hover:underline" href="/admin">← Back to admin</a>
      </p>
    </header>

    {#if form?.error}
      <div class="rounded-xl border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-200 ring-1 ring-inset ring-red-500/10">
        {form.error}
      </div>
    {/if}

    <form
      method="POST"
      class="space-y-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-xl shadow-black/25 ring-1 ring-inset ring-white/5 backdrop-blur-md"
    >
      <label class="block space-y-1.5">
        <span class="text-sm text-zinc-400">Name</span>
        <input
          class="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-100 outline-none ring-1 ring-inset ring-white/5 transition focus:border-teal-500/50 focus:ring-teal-500/20"
          name="name"
          required
          placeholder="Spearhead Summer 26"
          value={form?.name ?? ''}
        />
      </label>

      <label class="block space-y-1.5">
        <span class="text-sm text-zinc-400">Slug <span class="font-normal text-zinc-500">(optional)</span></span>
        <input
          class="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-3 py-2.5 font-mono text-sm text-zinc-100 outline-none ring-1 ring-inset ring-white/5 transition focus:border-teal-500/50 focus:ring-teal-500/20"
          name="slug"
          placeholder="spearhead-summer-26"
          value={form?.slug ?? ''}
        />
        <span class="text-xs text-zinc-500">Public URL: <span class="font-mono text-zinc-400">/l/&lt;slug&gt;</span></span>
      </label>

      <button
        class="mt-2 w-full rounded-xl bg-zinc-100 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-black/20 transition hover:bg-white"
        type="submit"
      >
        Create league
      </button>
    </form>
  </div>
</main>
