<script lang="ts">
  import { page } from "$app/state";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { onMount, tick } from "svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { billStore } from "$lib/stores/bill-store";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { CheckIcon, ChevronsUpDownIcon } from "lucide-svelte";
  import type { Bill } from "$lib/models/bill";
  import { cn } from "$lib/utils";
  import { toast } from "svelte-sonner";
  import api from "$lib/utils/request";

  let billId: string | null = null;
  let bill: Bill | undefined = $state(undefined);

  let remainingUses = $state(1);
  let open = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);
  let token = $state<string | null>(null);
  function closeAndFocusTrigger() {
    tick().then(() => {
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
  onMount(async () => {
    const urlParams = new URLSearchParams(page.url.search);
    billId = urlParams.get("billId");
    if (!billId) return;
    bill = billStore.getBillById(billId!);
    if (!bill) return;
    console.log("bill:", bill);

    if (!billId) {
      return;
    }
  });

  $effect(() => {
    if (remainingUses < 1 || remainingUses > 16) {
      remainingUses = 1;
    }
  });

  async function shareBill() {
    if (!billId) {
      toast.error("分享失败", {
        description: `未找到账单ID`,
      });
      return;
    }

    if (!bill) {
      toast.error("分享失败", {
        description: `未找到账单信息`,
      });
      return;
    }
    let user = bill!.members.find((m) => m.name === userSelected);

    let data = {
      bill_id: bill.id,
      access_role: roleSelected,
      remaining_uses: remainingUses,
      bill_member_id: user?.id,
    };
    api.post(`/bill/share`, data).then((response) => {
      toast.success("分享成功", {
        description: `账单已成功分享给 ${userSelected}，剩余使用次数: ${remainingUses}`,
      });
      token = response.data.token;
    });
  }
</script>

<Card.Root class="mx-auto w-full max-w-sm">
  <Card.Header>
    <Card.Title>分享账单 {bill?.title}</Card.Title>
  </Card.Header>
  <Card.Content>
    {#if !token}
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label class="mt-2">使用次数</Label>
          <Label class="text-gray-500 text-sm">可取范围在1-16</Label>
          <Input
            type="number"
            min="1"
            placeholder="请输入使用次数"
            bind:value={remainingUses}
          />

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

          <Label class="mt-2">邀请用户</Label>
          <Label class="text-gray-500 text-sm">可选.</Label>
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

          <Button variant="outline" class="mt-5" onclick={shareBill}
            >确定</Button
          >
        </div>
      </div>
    {:else}
      <div class="text-center">
        <p>分享成功, Token: {token}</p>
      </div>
    {/if}
  </Card.Content>
</Card.Root>
