<script lang="ts">
  import { Label } from "$lib/components/ui/label";
  const id = Math.trunc(Math.random() * Number.MAX_SAFE_INTEGER).toString();
  export let title = "";
  export let description = "";
</script>

<div class="grid gap-2 mt-1 mb-1">
  <Label for="userName-{id}">{title}</Label>
  <Label class="text-gray-500 text-sm">{description}</Label>
  <slot />
</div>
