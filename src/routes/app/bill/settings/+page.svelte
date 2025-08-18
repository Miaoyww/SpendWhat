<script lang="ts">
  import { currentBill } from "$lib/stores/bill-store";
  import { NavigateTo } from "$lib/utils/navigating";

  if (!$currentBill) {
    NavigateTo("/");
  }
</script>
