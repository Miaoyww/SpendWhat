<script lang="ts">
  import { page } from "$app/state";
  import type { Bill } from "$lib/models/bill";
  import { billStore } from "$lib/stores/bill-store";
  import { onMount } from "svelte";

  let bill: Bill | undefined = $state(undefined);

  onMount(() => {
    const billId = page.url.searchParams.get("id");
    if (billId) {
      console.log("是");
    }
    console.log(bill);
  });
</script>
