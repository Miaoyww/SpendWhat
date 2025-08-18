<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import {
    Plus,
    Settings,
    SquareArrowOutUpRight,
    RefreshCcw,
  } from "lucide-svelte";
  import SidebarTrigger from "$lib/components/ui/sidebar/sidebar-trigger.svelte";
  import { NavigateTo, isBillPage } from "$lib/utils/navigating";
  import { billStore, currentBill } from "$lib/stores/bill-store";
  import { Bill } from "$lib/models/bill";
  import ShareCard from "../dialog/share-card/share-card.svelte";
  let isBillNow: boolean = $state(false);
  let isSharing = $state(false);

  isBillPage.subscribe((value) => {
    isBillNow = value;
  });
</script>

<header
  class="h-(--header-height) group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear"
>
  <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
    <SidebarTrigger class="-ml-1" />
    <Separator
      orientation="vertical"
      class="mx-2 data-[orientation=vertical]:h-4"
    />
    <Button
      variant="ghost"
      class="text-base font-medium"
      onclick={() => {
        if (isBillNow) {
          NavigateTo(`/app/bill/detail`);
        } else {
          NavigateTo("/");
        }
      }}
    >
      {#if isBillNow}
        {#if currentBill}
          {$currentBill?.title}
        {/if}
      {:else}
        SpendWhat
      {/if}
    </Button>

    <div class="ml-auto flex items-center gap-2">
      <div class="grid grid-cols-4 gap-4">
        <div class="...">
          {#if isBillNow}
            <Button
              variant="ghost"
              size="sm"
              class="sm:flex outline outline-offset-2"
              onclick={() => {
                if (currentBill) {
                  billStore.refreshBill();
                }
              }}
            >
              <RefreshCcw />
            </Button>
          {/if}
        </div>
        <div class="...">
          {#if isBillNow}
            <Button
              variant="ghost"
              size="sm"
              class="sm:flex outline outline-offset-2"
              onclick={() => {
                if (currentBill) {
                  NavigateTo(`/app/bill/settings`);
                }
              }}
            >
              <Settings />
            </Button>
          {/if}
        </div>
        <div class="...">
          {#if isBillNow}
            <Button
              variant="ghost"
              size="sm"
              class="sm:flex outline outline-offset-2"
              onclick={() => {
                isSharing = true;
              }}
            >
              <SquareArrowOutUpRight />
            </Button>
          {/if}
        </div>
        <div class="...">
          <Button
            variant="ghost"
            size="sm"
            class="sm:flex outline outline-offset-2"
            onclick={() => {
              NavigateTo("/");
            }}
          >
            <Plus />
          </Button>
        </div>
      </div>
    </div>
  </div>
</header>

<ShareCard bill={$currentBill!} bind:open={isSharing} showDetail={true} />
