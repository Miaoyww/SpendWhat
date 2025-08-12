<script lang="ts">
  import { BillItem } from "$lib/models/bill/bill-item";
  import { Button } from "$lib/components/ui/button";
  import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "$lib/components/ui/dialog";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { showAlert } from "$lib/stores/alert-dialog-store";
  import { billStore, currentBill } from "$lib/stores/bill-store";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import type { User } from "$lib/models/user";
  import { CheckIcon, ChevronsUpDownIcon } from "lucide-svelte";
  import { tick } from "svelte";
  import { cn } from "$lib/utils";
  import type { Bill } from "$lib/models/bill/bill";

  const { item } = $props<{ item: BillItem }>();

  let editOpen = $state(false);
  let open = $state(false);
  let value = $state(item.created_by.username);
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(
    (item.bill.members as User[]).find((f) => f.username === value)?.username
  );

  let form = $state({
    description: item.description ?? "",
    amount: item.amount ?? 0,
    currency: item.currency ?? "CNY",
    type: item.type ?? "other",
    type_icon: item.type_icon ?? "",
    created_by: item.created_by ?? "",
    occurred_time: item.occurred_time
      ? item.occurred_time.toISOString().slice(0, 16)
      : "",
  });

  async function saveEdit() {
    try {
      editOpen = false;
      const updated: BillItem = new BillItem(
        item.bill,
        form.type,
        form.type_icon,
        form.description,
        Number(form.amount),
        form.currency,
        form.created_by,
        form.occurred_time,
        item.created_time
      );
      updated.id = item.id; // 保持原有ID
      console.log("保存编辑的账单项:", updated);
      await item.bill.updateItem(updated);
      currentBill.set(item.bill);
    } catch (err) {
      console.error(err);
      showAlert("保存失败", "更新账单项失败，请重试。");
    }
  }

  async function deleteItem() {
    item.bill.removeItem(item);
    currentBill.set(item.bill);
    return;
  }

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }
</script>

<div
  class="flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow-md bg-white"
>
  <div class="flex items-center gap-3">
    <div
      class="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100"
    >
      <!-- 简单把 type_icon 当文字/emoji 显示，或换成 lucide icon -->
      <span class="text-lg">{item.type_icon || "💸"}</span>
    </div>
    <div>
      <div class="font-medium text-sm">{item.description}</div>
      <div class="text-xs text-muted-foreground">
        由{item.created_by.username}支付
      </div>
    </div>
  </div>

  <div class="flex items-center gap-3">
    <div class="text-right">
      <!-- <div class="font-semibold">{item.amount.toFixed(2)} {item.currency}</div> -->
      <div class="font-semibold">{item.amount} {item.currency}</div>
      <div class="text-xs text-muted-foreground">
        发生时间 {item.occurred_time.toLocaleString()}
      </div>
    </div>

    <div class="flex gap-2">
      <Dialog bind:open={editOpen}>
        <DialogTrigger>
          <Button variant="ghost" size="sm">编辑</Button>
        </DialogTrigger>
        <DialogContent class="w-[420px]">
          <DialogHeader>
            <DialogTitle>编辑账单项</DialogTitle>
          </DialogHeader>

          <div class="grid gap-2">
            <Label class="text-sm">描述</Label>
            <Input bind:value={form.description} />

            <Label class="text-sm">金额</Label>
            <Input type="number" bind:value={form.amount} step="0.01" />

            <Label class="text-sm">货币</Label>
            <Input bind:value={form.currency} />

            <Label class="text-sm">类型</Label>
            <Input bind:value={form.type} />

            <Label class="text-sm">支付方</Label>

            <Popover.Root bind:open>
              <Popover.Trigger bind:ref={triggerRef}>
                {#snippet child({ props })}
                  <Button
                    {...props}
                    variant="outline"
                    class="w-[200px] justify-between"
                    role="combobox"
                    aria-expanded={open}
                  >
                    {selectedValue || "选择支付方"}
                    <ChevronsUpDownIcon class="opacity-50" />
                  </Button>
                {/snippet}
              </Popover.Trigger>
              <Popover.Content class="w-[200px] p-0">
                <Command.Root>
                  <Command.Input placeholder="搜索成员..." />
                  <Command.List>
                    <Command.Empty>暂无成员.</Command.Empty>
                    <Command.Group value="members">
                      {#each item.bill.members as memberItem (memberItem.id)}
                        <Command.Item
                          value={memberItem.username}
                          onSelect={() => {
                            value = memberItem.username;
                            closeAndFocusTrigger();
                          }}
                        >
                          <CheckIcon
                            class={cn(
                              value !== memberItem.username &&
                                "text-transparent"
                            )}
                          />
                          {memberItem.username}
                        </Command.Item>
                      {/each}
                    </Command.Group>
                  </Command.List>
                </Command.Root>
              </Popover.Content>
            </Popover.Root>

            <Label class="text-sm">发生时间</Label>
            <Input type="datetime-local" bind:value={form.occurred_time} />
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onclick={() => {
                editOpen = false;
              }}>取消</Button
            >
            <Button onclick={saveEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button variant="destructive" size="sm" onclick={deleteItem}>删除</Button>
    </div>
  </div>
</div>
