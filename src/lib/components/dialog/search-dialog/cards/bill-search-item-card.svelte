<script lang="ts">
  import { Label } from "$lib/components/ui/label";
  import { Bill } from "$lib/models/bill";
  import { cn } from "$lib/utils";
  import { NavigateTo } from "$lib/utils/navigating";
  import { ReceiptText } from "lucide-svelte";
  import {
    searchDialog,
    showSearchDialog,
    hideSearchDialog
  } from "$lib/stores/search-dialog-store";
  import { currentBill } from "$lib/stores/bill-store";

  let { bill } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->

<div
  class={cn(
    "flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer",
    "mt-3"
  )}
  onclick={() => {
    hideSearchDialog();
    currentBill.set(bill);
    NavigateTo(`/bill/detail?id=${bill.id}`);
  }}
>
  <!-- 图标 -->
  <ReceiptText size={16} />
  <!-- 标题 -->
  <div class="flex-1">
    <Label class="text-base">{bill.title}</Label>
  </div>
</div>
