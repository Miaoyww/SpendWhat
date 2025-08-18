<script lang="ts">
  import BillItemAddCard from "$lib/components/bills/item/bill-item-add-card.svelte";
  import BillItemCard from "$lib/components/bills/item/bill-item-card.svelte";
  import { Button } from "$lib/components/ui/button";
  import { BillItem } from "$lib/models/bill-item";
  import { currentBill } from "$lib/stores/bill-store";
  import { currentUser } from "$lib/stores/user-store";
  import { Menu, Plus } from "lucide-svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Label } from "$lib/components/ui/label";
  import { NavigateTo } from "$lib/utils/navigating";

  if (!$currentBill) {
    NavigateTo("/");
  }

  let showAddDialog = $state(false);
  let sortedBillItems = $state<BillItem[]>([]);

  let selfTotal = $derived.by(() => {
    return $currentBill!.getMemberSpending(
      $currentBill!.getUserFromBillMember($currentUser!)!
    );
  });

  let billTotal = $derived.by(() => {
    return $currentBill!.totalAmount;
  });

  currentBill.subscribe((value) => {
    if (!value) return;
    console.log("Current bill changed:", value);
    sortItems(value.items);
  });

  function sortItems(value: BillItem[]) {
    if (!value) return;
    sortedBillItems = [];
    sortedBillItems = value.sort((a, b) => {
      return (
        new Date(b.occurred_time).getTime() -
        new Date(a.occurred_time).getTime()
      );
    });
  }
</script>

<div class="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-8">
  <!-- 团队预算 -->
  <Card.Root class="flex flex-col">
    <Card.Content>
      <!-- 上方内容 -->
      <div class="flex flex-col items-left">
        <Label class="text-lg font-bold">你已支出</Label>
        <Label class="text-base font-bold"
          >{selfTotal}
          {$currentBill!.currency}</Label
        >
      </div>

      <!-- 底部按钮 -->
      <div class="flex justify-center">
        <Button
          variant="ghost"
          class="mt-3 w-28 h-28 rounded-full border-6 border-gray-300 items-center text-sm"
        >
          添加预算
        </Button>
      </div>
    </Card.Content>
  </Card.Root>

  <!-- 右边上下排列 -->
  <div class="flex flex-col gap-2">
    <!-- 团队共支出 -->
    <Card.Root>
      <Card.Content class="flex flex-col items-left justify-center">
        <!--左并列-->
        <div class="flex flex-col items-left">
          <Label class="text-lg font-bold">团队共支出</Label>
          <Label class="text-base font-bold"
            >{billTotal} {$currentBill!.currency}</Label
          >
        </div>

        <div class="text-base mt-2">{$currentBill!.items.length} 笔交易</div>
      </Card.Content>
    </Card.Root>

    <!-- 成员管理 -->
    <Card.Root>
      <Card.Content class="p-0">
        <div class="flex items-center justify-between ml-5">
          <!-- 左边文字 -->
          <div class="flex flex-col">
            <Label class="text-base font-bold">成员管理</Label>
            <Label class="text-sm"
              >当前 {$currentBill!.members.length} 名成员</Label
            >
          </div>

          <!-- 右边图标按钮 -->
          <Button
            variant="ghost"
            class="mr-3"
            onclick={() => {
              NavigateTo(`/app/bill/member`);
            }}
          >
            <Menu size={36} />
          </Button>
        </div>
      </Card.Content>
    </Card.Root>
  </div>
</div>

<Label class="text-lg mb-2">账单</Label>

{#if $currentBill}
  {#if sortedBillItems}
    <div class="space-y-2">
      {#each sortedBillItems as item (item.uiId)}
        <BillItemCard {item} />
      {/each}
    </div>
  {/if}
{/if}

<Button
  class="absolute bottom-10 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full shadow-lg"
  onclick={() => {
    showAddDialog = true;
    console.log(showAddDialog);
  }}
>
  <Plus size={24} />
</Button>

{#key showAddDialog}
  <BillItemAddCard
    title="添加新账单"
    bind:open={showAddDialog}
    bill={$currentBill}
  />
{/key}
