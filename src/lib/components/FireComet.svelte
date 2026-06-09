<script lang="ts">
  import FireSprite from './FireSprite.svelte';
</script>

<span class="points-comet" aria-hidden="true">
  <FireSprite size={26} />
</span>

<style>
  .points-comet {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(50%, -50%);
    pointer-events: none;
  }
</style>
