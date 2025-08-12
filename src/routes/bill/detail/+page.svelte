<script lang="ts">
  import { page } from "$app/state";
  import BillItemCard from "$lib/components/bills/bill-item-card.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Bill } from "$lib/models/bill/bill";
  import { BillItem } from "$lib/models/bill/bill-item";
  import { User } from "$lib/models/user";
  import { billStore, currentBill } from "$lib/stores/bill-store";
  import { currentUser } from "$lib/stores/user-store";
  import { onMount } from "svelte";

  let bill: Bill | undefined;
  let user: User | null;
  let id: string | null = $state(null);

  let bill_type: string = $state("expense"); // 默认账单类型
  let description: string = $state("AAA");
  let amount: number = $state(0);
  let currency: string = $state("CNY");
  let emoji: string = $state("😭");

  currentUser.subscribe((value) => {
    user = value;
  });
  let sortedBillItems = $state<BillItem[]>([]);

  currentBill.subscribe((value) => {
    if (value) {
      sortItems(value.items);
    }
  });

  $effect(() => {
    id = page.url.searchParams.get("id");
    if (id) {
      bill = billStore.getBillById(id);
      if (bill) {
        if (bill.items.length === 0) {
          //尝试从服务器获取items
          bill.getItemFromServer();
        }
      }
      currentBill.set(bill);
    }
  });

  onMount(() => {
    if ($currentBill?.items) {
      sortItems($currentBill.items);
    }
  });

  function sortItems(value: BillItem[]) {
    if (value) {
      sortedBillItems = value.sort((a, b) => {
        return (
          new Date(b.created_time).getTime() -
          new Date(a.created_time).getTime()
        );
      });
    } else {
      sortedBillItems = [];
    }
  }

  async function addNewItem() {
    if (!user) {
      return;
    }
    if (!bill) {
      return;
    }
    let newItem = new BillItem(
      bill,
      bill_type,
      emoji,
      description,
      amount,
      currency,
      user,
      new Date().toISOString(),
      new Date().toISOString()
    );
    await newItem.createToServer();
    bill?.addItem(newItem);

    currentBill.set(bill);
  }
</script>

<h1>账单详情页</h1>
<p>账单ID: {id}</p>
<Button onclick={addNewItem}>Add New</Button>
<Input bind:value={bill_type} placeholder="类型" />
<Input bind:value={description} placeholder="description" />
<Input bind:value={amount} type="number" placeholder="amount" />
<Input bind:value={emoji} type="str" placeholder="emoji" />
<Input bind:value={currency} placeholder="currency" />

{#if $currentBill}
  {#if sortedBillItems}
    <div class="space-y-2">
      {#each sortedBillItems as item (item.id)}
        <BillItemCard {item} />
      {/each}
    </div>
  {/if}
{/if}
