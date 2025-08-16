<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";
  import XIcon from "@lucide/svelte/icons/x";
  import type { Snippet } from "svelte";
  import * as Dialog from "./index.js";
  import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
  import Input from "./input.svelte";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import type { Bill } from "$lib/models/bill.js";
  import { billStore } from "$lib/stores/bill-store.js";
  import { ReceiptText } from "lucide-svelte";
  import BillSearchItemCard from "../cards/bill-search-item-card.svelte";
  import { Label } from "$lib/components/ui/label/index.js";
  import Fuse from "fuse.js";

  let {
    ref = $bindable(null),
    class: className,
    portalProps,
    children,
    showCloseButton = true,
    ...restProps
  }: WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
    portalProps?: DialogPrimitive.PortalProps;
    children: Snippet;
    showCloseButton?: boolean;
  } = $props();

  let searchContent = $state("");
  let filteredItems: Bill[] = $state([]);

  let fuse: Fuse<Bill>;
  $effect(() => {
    if ($billStore.length > 0) {
      fuse = new Fuse($billStore, {
        keys: ["title"], // 搜索的字段
        threshold: 0.4, // 模糊匹配程度 (0.0 精确匹配 ~ 1.0 非常模糊)
      });
      if (fuse) {
        filteredItems = fuse.search(searchContent).map((result) => result.item);
      }
    }
  });
</script>

<Dialog.Portal {...portalProps}>
  <Dialog.Overlay />
  <DialogPrimitive.Content
    bind:ref
    data-slot="dialog-content"
    class={cn(
      "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed left-[50%] top-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
      className
    )}
    {...restProps}
  >
    <!-- Input + 内置 Close 按钮 -->
    <div class="relative w-full mb-5">
      <Input
        class="w-full pr-10"
        placeholder="搜索账单..."
        bind:value={searchContent}
      />
      {#if showCloseButton}
        <DialogPrimitive.Close
          class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 opacity-70 hover:opacity-100"
        >
          <XIcon />
        </DialogPrimitive.Close>
      {/if}
    </div>
    <Separator />
    <div>
      {#if searchContent}
        {#if filteredItems.length > 0}
          {#each filteredItems as item}
            <BillSearchItemCard bill={item} />
          {/each}
        {:else}
          <Label class="p-2 text-gray-500 text-base mt-2">暂无记录</Label>
        {/if}
      {:else if $billStore.length > 0}
        {#each $billStore as item}
          <BillSearchItemCard bill={item} />
        {/each}
      {:else}
        <Label class="p-2 text-gray-500 text-base mt-2">暂无记录</Label>
      {/if}
    </div>
  </DialogPrimitive.Content>
</Dialog.Portal>
