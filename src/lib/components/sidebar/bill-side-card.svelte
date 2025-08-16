<script lang="ts">
  import { Ellipsis, Trash, Share, PenLine } from "lucide-svelte";

  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "$lib/components/ui/dialog/index.js";
  import { billStore, currentBill } from "$lib/stores/bill-store";
  import { Bill } from "$lib/models/bill";
  import { NavigateTo } from "$lib/utils/navigating";
  import { Input } from "$lib/components/ui/input/index.js";
  import { HOST_URL } from "$lib/utils/request";
  import { cn } from "$lib/utils";
  import ShareCard from "../dialog/share-card/share-card.svelte";

  const props = $props<{ bill: Bill }>();
  let { bill } = props;

  let isRenaming = $state(false);
  let isSharing = $state(false);

  let title: string = $state(bill.title);
  let className = $state("");

  currentBill.subscribe((value) => {
    if (value) {
      className = value.id === bill.id ? "bg-gray-200" : "";
    }
  });
</script>

<Dialog bind:open={isRenaming}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>重命名账单</DialogTitle>
      <DialogDescription>请输入新的账单名称</DialogDescription>
      <Input
        bind:value={title}
        oninput={(e) => {
          bill.title = (e.target as HTMLInputElement).value;
          currentBill.set(bill);
          console.log("Updated bill title:", bill.title);
        }}
      />
    </DialogHeader>
    <DialogFooter>
      <Button
        onclick={() => {
          isRenaming = false;
          billStore.updateBill(bill);
        }}
        type="submit"
      >
        确定
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<ShareCard {bill} bind:open={isSharing} showDetail={true} />

<Sidebar.MenuButton
  id={bill.id}
  class={cn(
    "flex justify-between outline outline-offset-2 p-0 items-center flex-1 text-left group/item h-10 mt-2 rounded-xl cursor-pointer",
    className
  )}
  onclick={async () => {
    currentBill.set(bill);
    await $currentBill?.getItemFromServer();
    NavigateTo(`/bill/detail?id=${bill.id}`);
  }}
>
  <span
    class="ml-2 text-[14px] text-left line-clamp-1 max-w-[12rem] text-pretty"
    >{title}</span
  >
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      class="group/edit visible md:invisible md:group-hover/item:visible ghost bg-transparent px-2 py-1 text-sm rounded"
    >
      <Ellipsis strokeWidth={1} />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-56">
      <DropdownMenu.Group>
        <DropdownMenu.Item
          onclick={() => {
            isSharing = true;
          }}
        >
          <div class="flex justify-between items-center">
            <Share size={28} strokeWidth={2} class="mr-2" />
            <span class="text-base">分享</span>
          </div>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onclick={() => {
            isRenaming = true;
          }}
        >
          <div class="flex justify-between items-center">
            <PenLine size={28} strokeWidth={2} class="mr-2" />
            <span class="text-base">重命名</span>
          </div>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          onclick={() => {
            if (!bill.id) {
              return;
            }
            billStore.removeBill(bill.id);
          }}
        >
          <div class="flex justify-between items-center">
            <Trash color="#e02e2e" strokeWidth={2} size={28} class="mr-2" />
            <span class="text-base text-[#e02e2e]">删除</span>
          </div>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</Sidebar.MenuButton>
