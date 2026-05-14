<script lang="ts">
  import { toast } from '$lib/toast';
</script>

{#if $toast}
  <div class="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3">
    <div
      class={[
        'pointer-events-auto w-full max-w-md rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur',
        $toast.type === 'success'
          ? 'border-emerald-900/60 bg-emerald-950/60 text-emerald-100'
          : 'border-red-900/60 bg-red-950/60 text-red-100'
      ].join(' ')}
      role="status"
      aria-live="polite"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="font-medium">{$toast.message}</div>
        <button
          type="button"
          class="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs hover:bg-white/10"
          on:click={() => toast.clear()}
        >
          Close
        </button>
      </div>
    </div>
  </div>
{/if}
