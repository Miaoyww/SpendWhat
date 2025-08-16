<script lang="ts">
  import { page } from "$app/state";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";

  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Bill } from "$lib/models/bill";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import api from "$lib/utils/request";
  import { tick } from "svelte";
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button";
  import { CalendarIcon, CheckIcon, ChevronsUpDownIcon } from "lucide-svelte";
  import { cn } from "$lib/utils";
  import { BillMember } from "$lib/models/bill-member";
  import { Calendar } from "$lib/components/ui/calendar/index.js";

  let {
    bill = $bindable<Bill>(),
    open = $bindable<boolean>(),
    showDetail = $bindable<boolean>(),
  } = $props<{
    open: boolean;
    bill: Bill;
    showDetail: boolean;
  }>();

  let shareSuccess = $state(false);
  let remainingUses = $state(1);
  let selectorOpen = $state(false);
  let userInvite = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);
  let token = $state<string | null>(null);

  function closeAndFocusTrigger() {
    tick().then(() => {
      selectorOpen = false;
      triggerRef.focus();
    });
  }

  let roleOptions = [
    { value: "owner", label: "拥有者" },
    { value: "member", label: "成员" },
    { value: "observer", label: "游客" },
  ];

  let roleSelected = $state("observer");
  const roleTriggerContent = $derived(
    roleOptions.find((f) => f.value === roleSelected)?.label ?? "选择权限"
  );

  let userSelected = $state("");

  function daysLater(days: number) {
    let d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  }
  let dateOptions = [
    { value: "1", label: "1天" },
    { value: "3", label: "3天" },
    { value: "7", label: "7天" },
  ];
  let dateSelected = $state("1");
  const dateTriggerContent = $derived(
    dateOptions.find((f) => f.value === dateSelected)?.label ?? "选择时间"
  );

  $effect(() => {
    if (remainingUses < 1 || remainingUses > 16) {
      remainingUses = 1;
    }
  });

  async function shareBill() {
    if (!bill) {
      toast.error("分享失败", {
        description: `未找到账单信息`,
      });
      return;
    }
    let user = (bill!.members as BillMember[]).find(
      (m) => m.name === userSelected
    );

    let data = {
      bill_id: bill.id,
      access_role: roleSelected,
      remaining_uses: userInvite ? 1 : remainingUses,
      ...(userInvite && user ? { bill_member_id: user.id } : {}),
      expires_at: daysLater(Number(dateSelected)).toLocaleString("sv-SE"),
    };

    if (userInvite && !user) {
      toast.error("分享失败", {
        description: `未找到用户信息`,
      });
      open = false;
      return;
    }

    api.post(`/bill/share`, data).then((response) => {
      toast.success("分享成功", {
        description: `账单已成功分享给 ${userSelected}，剩余使用次数: ${remainingUses}`,
      });
      token = response.data.token;
      shareSuccess = true;
    });
    open = false;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>分享账单</Dialog.Title>
      <Dialog.Description>将此账单分享给其他用户</Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4">
      <div class="grid gap-2">
        {#if !userInvite}
          <Label class="mt-2">使用次数</Label>
          <Label class="text-gray-500 text-sm">可取范围在1-16</Label>
          <Input
            type="number"
            min="1"
            placeholder="请输入使用次数"
            bind:value={remainingUses}
          />
        {/if}
        <Label class="text-sm">过期时间</Label>
        <Select.Root
          type="single"
          name="favoriteFruit"
          bind:value={dateSelected}
        >
          <Select.Trigger class="w-[180px]">
            {dateTriggerContent}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Label>过期时间</Select.Label>
              {#each dateOptions as item (item.value)}
                <Select.Item
                  value={item.value}
                  label={item.label}
                  disabled={item.value === "grapes"}
                >
                  {item.label}
                </Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>

        <Label>选择权限</Label>
        <Label class="text-gray-500 text-sm"
          >邀请加入的成员默认拥有的权限.</Label
        >
        <Select.Root
          type="single"
          name="favoriteFruit"
          bind:value={roleSelected}
        >
          <Select.Trigger class="w-[180px]">
            {roleTriggerContent}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Label>权限</Select.Label>
              {#each roleOptions as item (item.value)}
                <Select.Item
                  value={item.value}
                  label={item.label}
                  disabled={item.value === "grapes"}
                >
                  {item.label}
                </Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>

        <div class="flex items-center space-x-2 mt-2">
          <Label for="invite-user">邀请用户</Label>
          <Switch id="invite-user" bind:checked={userInvite} />
        </div>
        <Label class="text-gray-500 text-sm">可选.选择用户后仅可使用一次</Label>
        {#if userInvite}
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
                  {userSelected || "选择邀请的用户"}
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
                    {#each bill!.members as memberItem (memberItem.id)}
                      {#if !memberItem.user}
                        <Command.Item
                          value={memberItem.name}
                          onSelect={() => {
                            userSelected = memberItem.name;
                            closeAndFocusTrigger();
                          }}
                        >
                          <CheckIcon
                            class={cn(
                              userSelected !== memberItem.name &&
                                "text-transparent"
                            )}
                          />
                          {memberItem.name}
                        </Command.Item>
                      {/if}
                    {/each}
                  </Command.Group>
                </Command.List>
              </Command.Root>
            </Popover.Content>
          </Popover.Root>
        {/if}
        <Button variant="outline" class="mt-5" onclick={shareBill}>确定</Button>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={shareSuccess}>
  <Dialog.Content>
    <Dialog.Header>分享成功</Dialog.Header>
    <div>
        <Label >复制Token, 邀请其他人加入账单!</Label>
        <Input class="mt-4" bind:value={token} readonly />
    </div>
    <Dialog.Footer>
        <Button variant="ghost" onclick={() => shareSuccess = false}>确定</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
