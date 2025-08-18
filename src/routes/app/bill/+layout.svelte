<script lang="ts">
  import { NavigateTo } from "$lib/utils/navigating";
  import { currentBill } from "$lib/stores/bill-store";

  if (!$currentBill) {
    NavigateTo("/");
  }
</script>

<slot />
