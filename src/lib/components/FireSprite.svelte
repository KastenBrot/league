<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { FIRE_SPRITE } from '$lib/sprites';

  export let size = 32;
  export let opacity = 1;

  let frame = 0;
  let timer: ReturnType<typeof setInterval> | undefined;

  $: col = frame % FIRE_SPRITE.cols;
  $: row = Math.floor(frame / FIRE_SPRITE.cols);
  $: spriteStyle = [
    `background-image: url(${FIRE_SPRITE.url})`,
    `background-position: ${-col * size}px ${-row * size}px`,
    `background-size: ${FIRE_SPRITE.cols * size}px ${FIRE_SPRITE.rows * size}px`,
    `width: ${size}px`,
    `height: ${size}px`,
    `opacity: ${opacity}`
  ].join('; ');

  onMount(() => {
    const ms = 1000 / FIRE_SPRITE.fps;
    timer = setInterval(() => {
      frame = (frame + 1) % FIRE_SPRITE.frames;
    }, ms);
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });
</script>

<span
  class="inline-block shrink-0 bg-no-repeat"
  style={spriteStyle}
  role="presentation"
  aria-hidden="true"
></span>

<style>
  span {
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }
</style>
