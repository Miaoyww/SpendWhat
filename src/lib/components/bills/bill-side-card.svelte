<script lang="ts">
  import { Ellipsis, Trash, Share, PenLine } from "lucide-svelte";

  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
  } from "$lib/components/ui/alert-dialog";
  import { currentUser } from "$lib/stores/user-store";
  import { User } from "$lib/models/user";
  import { billStore } from "$lib/stores/bill-store";
  import { Bill } from "$lib/models/bill/bill";
  import { NavigateTo } from "$lib/stores/navigating";
  import { Input } from "$lib/components/ui/input/index.js";

  const props = $props<{ billItem: Bill }>();
  const { billItem } = props;

  let user: User | null = $state(null);
  let isRenaming = $state(false);
  let menuIsOpen = $state(false);
  currentUser.subscribe((value) => {
    user = value;
  });

  let bills: Bill[] = $state([]);

  billStore.subscribe((value) => {
    bills = value;
  });

</script>

<AlertDialog bind:open={isRenaming}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>重命名账单</AlertDialogTitle>
      <AlertDialogDescription>请输入新的账单名称</AlertDialogDescription>
      <Input bind:value={billItem.title} />
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction
        onclick={() => {
          isRenaming = false;
          billStore.updateBill(billItem);
        }}>
        确定
        </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

<Sidebar.MenuButton
  class="flex justify-between items-center flex-1 text-left group/item h-10 mt-2 rounded-xl "
>
  <Button
    class="outline outline-offset-2"
    onclick={() => {
      NavigateTo(`/bill/detail?id=${billItem.id}`);
      billStore.currentBill.set(billItem);
    }}
    variant="ghost"
  >
    <span class="-ml-3 text-base">{billItem.title}</span>
  </Button>

  <DropdownMenu.Root bind:open={menuIsOpen}>
    <DropdownMenu.Trigger
      class="group/edit invisible group-hover/item:visible ghost bg-transparent px-2 py-1 text-sm rounded"
    >
      <Ellipsis strokeWidth={1} />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-56">
      <DropdownMenu.Group>
        <DropdownMenu.Item>
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
            if (!billItem.id) {
              return;
            }
            billStore.removeBill(billItem.id);
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
