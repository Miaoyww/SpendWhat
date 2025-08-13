<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label";
  import * as Select from "$lib/components/ui/select/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { currentUser } from "$lib/stores/user-store";
  import type { User } from "$lib/models/user";
  import { CheckIcon, ChevronsUpDownIcon } from "lucide-svelte";
  import { tick } from "svelte";
  import { cn } from "$lib/utils";
  import type { Bill } from "$lib/models/bill";
  import { currentBill } from "$lib/stores/bill-store";
  import { BillItem } from "$lib/models/bill-item";
  import { showAlert } from "$lib/stores/alert-dialog-store";

  let {
    title,
    open = $bindable(),
    bill,
  } = $props<{
    title: string;
    open: boolean;
    bill: Bill | undefined;
  }>();

  // 限制的 emoji 列表
  const allowedEmojis = [
    {
      value: "😭",
      label: "1",
    },
    {
      value: "😂",
      label: "2",
    },
    {
      value: "😍",
      label: "3",
    },
    {
      value: "🤔",
      label: "4",
    },
    {
      value: "😎",
      label: "5",
    },
  ];

  // 限制的货币列表（从 user.currencies 获取）
  let allowedCurrencies = [
    {
      value: "USD",
      label: "usd",
    },
    {
      value: "EUR",
      label: "eur",
    },
    {
      value: "CNY",
      label: "cny",
    },
  ];

  let bill_type = $state("");
  let emoji = $state(allowedEmojis[0].value);
  let description = $state("");
  let amount: number = $state(0);
  let currency: string = $state(allowedCurrencies[0].value);
  let occurred_time = $state(new Date().toLocaleString("sv-SE"));

  let selectedUserName = $state($currentUser!.username);
  let selectorOpen = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);

  let selectedUser = $derived(() => {
    return (bill.members as User[]).find(
      (f) => f.username === selectedUserName
    );
  });
  const selectedValue = $derived(
    (bill.members as User[]).find((f) => f.username === selectedUserName)
      ?.username
  );
  const id = Math.trunc(Math.random() * Number.MAX_SAFE_INTEGER).toString();
  $effect(() => {
  });

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }

  async function addItem() {
    //如果有一项未填则不许通过
    if (!bill_type || !description || !amount || !currency || !emoji) {
      open = false;
      showAlert("错误", "请填写所有必填项");
      return;
    }

    let user = selectedUser();
    if (!user) {
      open = false;
      showAlert("错误", "请选择一个支付方");
      return;
    }
    if (!bill) {
      open = false;
      showAlert("错误", "bill不能为空");
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
      new Date(),
      new Date(occurred_time)
    );
    await newItem.createToServer();
    bill?.addItem(newItem);
    open = false;
    currentBill.set(bill);
  }
  function openAddBillDialog() {}

  async function handleAdd() {}
</script>

<Dialog.Root {open} onOpenChange={(v) => (open = v)}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>
        {title}
      </Dialog.Title>
    </Dialog.Header>

    <div class="grid gap-2">
      <Label class="text-sm">描述</Label>
      <Input bind:value={description} placeholder="描述" />

      <Label class="text-sm">类型</Label>
      <Input bind:value={bill_type} placeholder="类型" />

      <Label class="text-sm">表情</Label>
      <!-- 限制的 emoji 选择 -->
      <Select.Root type="single" bind:value={emoji}>
        <Select.Trigger>
          {emoji}
        </Select.Trigger>
        <Select.Content>
          {#each allowedEmojis as e (e.label)}
            <Select.Item value={e.value}>{e.value}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>

      <Label class="text-sm">金额</Label>
      <Input bind:value={amount} type="number" placeholder="金额" />

      <Label class="text-sm">货币</Label>
      <!-- 限制的货币选择 -->
      <Select.Root type="single" bind:value={currency}>
        <Select.Trigger>
          {currency}
        </Select.Trigger>
        <Select.Content>
          {#each allowedCurrencies as cur (cur.label)}
            <Select.Item value={cur.value}>{cur.value}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>

      <Label class="text-sm">支付方</Label>

      <Popover.Root bind:open={selectorOpen}>
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
                {#each bill.members as memberItem (memberItem.id)}
                  <Command.Item
                    value={memberItem.username}
                    onSelect={() => {
                      selectedUserName = memberItem.username;
                      closeAndFocusTrigger();
                    }}
                  >
                    <CheckIcon
                      class={cn(
                        selectedUserName !== memberItem.username &&
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
      <Input type="datetime-local" bind:value={occurred_time} />
    </div>

    <Dialog.Footer>
      <Button
        variant="ghost"
        onclick={() => {
          open = false;
        }}>取消</Button
      >
      <Button onclick={addItem}>添加</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
