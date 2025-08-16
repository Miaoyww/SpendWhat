<script lang="ts">
  import { BillMember } from "$lib/models/bill-member";
  import { ChevronRight, User } from "lucide-svelte";
  import { Button } from "../ui/button";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import api from "$lib/utils/request";
  import { currentBill } from "$lib/stores/bill-store";
  import { currentUser } from "$lib/stores/user-store";
  import { showAlert } from "$lib/stores/alert-dialog-store";
  import { Bill } from "$lib/models/bill";
  import ShareCard from "../dialog/share-card/share-card.svelte";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { Label } from "../ui/label";
  import { Input } from "../ui/input";
  import * as Select from "$lib/components/ui/select/index.js";
  import { BillRole } from "$lib/enum/roles";
  import { toast } from "svelte-sonner";
  import { NavigateTo } from "$lib/utils/navigating";

  let { member = $bindable<BillMember>(), bill = $bindable<Bill>() } = $props<{
    member: BillMember;
    bill: Bill;
  }>();

  let editCardOpen = $state(false);
  let shareCardOpen = $state(false);
  let bindCardOpen = $state(false);
  let roleOptions = [
    { value: "member", label: "读写" },
    { value: "observer", label: "只读" },
  ];
  let userName = $state(member.name);

  let roleSelected = $state(member.role);
  const roleTriggerContent = $derived(
    roleOptions.find((f) => f.value === roleSelected)?.label ?? "选择权限"
  );

  let currentUserRole = $derived(() => {
    if (bill.owner?.id === $currentUser!.id) {
      return BillRole.Owner;
    }

    const member = (bill.members as BillMember[]).find(
      (m) => m.user?.id === $currentUser!.id
    );
    if (member) {
      return member.role || BillRole.Observer;
    }

    return BillRole.Observer;
  });

  let roleEditAble = () => {
    return (
      member.user?.id !== $currentUser?.id &&
      currentUserRole() === BillRole.Owner
    );
  };
  let editAble = $derived(
    member.user?.id === $currentUser?.id || currentUserRole() === BillRole.Owner
  );

  let bindAble = $derived(() => {
    if (member.user) {
      return false;
    }

    // 遍历整个members, 如果有成员的linked_user是自己,则否
    return !$currentBill?.members.some((m) => m.user?.id === $currentUser?.id);
  });

  function saveEdit() {
    editCardOpen = false;
    console.log("保存成员信息:", userName, roleSelected);
    api
      .post("/bill/member/update", {
        bill_id: $currentBill?.id,
        bill_member_id: member.id,
        name: userName,
      })
      .then(() => {
        member.name = userName;
      })
      .catch((error) => {
        showAlert("错误", error.message || "网络错误");
      });
    if (member.user) {
      if (member.role !== roleSelected) {
        if (roleEditAble()) {
          api
            .post("/bill/access/update", {
              bill_id: $currentBill?.id,
              user_id: member.user?.id,
              role: roleSelected,
            })
            .then(() => {
              member.role = roleSelected;
            })
            .catch((error) => {
              showAlert("错误", error.message || "网络错误");
            });
        }
      }
    }
    toast.success("成员信息更新成功");
  }

  function removeMember() {
    let data = {
      bill_id: $currentBill?.id,
      bill_member_id: member.id,
    };
    editCardOpen = false;
    api
      .post("/bill/member/remove", data)
      .then(() => {
        let newBill = $currentBill;
        if (newBill) {
          newBill.members = $currentBill!.members.filter(
            (m) => m.id !== member.id
          );
        }
        currentBill.set(newBill);
      })
      .catch((error) => {
        showAlert("错误", error.message || "网络错误");
      });
  }

  function bindMember() {
    bindCardOpen = false;
    api
      .post("/bill/member/bind", {
        bill_id: $currentBill?.id,
        bill_member_id: member.id,
        user_id: $currentUser?.id,
      })
      .then(() => {
        member.bindUser($currentUser);
        NavigateTo(`/bill/detail?id=${$currentBill?.id}`);
        toast.success("成员绑定成功");
      })
      .catch((error) => {
        showAlert("错误", error.message || "网络错误");
      });
  }
</script>

<div
  class="flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow-md bg-white"
>
  <div class="flex items-center gap-3">
    <Avatar.Root>
      <Avatar.Fallback>{member.name.charAt(0)}</Avatar.Fallback>
    </Avatar.Root>
    <span class="text-base ml-1">{member.name}</span>
  </div>

  <div class="flex items-center gap-3">
    <div class="text-right">
      {#if bindAble()}
        <Button
          variant="ghost"
          onclick={() => {
            bindCardOpen = true;
          }}>绑定</Button
        >
      {/if}
      {#if currentUserRole() === BillRole.Owner}
        {#if !member.user}
          <Button
            variant="ghost"
            onclick={() => {
              shareCardOpen = true;
            }}>邀请</Button
          >
        {/if}
      {/if}

      {#if editAble}
        <Button
          variant="ghost"
          onclick={() => {
            editCardOpen = true;
          }}
        >
          <ChevronRight />
        </Button>
      {/if}
    </div>
  </div>
</div>

<Dialog.Root bind:open={editCardOpen}>
  <Dialog.Content class="max-w-md">
    <Dialog.Header>
      <Dialog.Title>成员详情</Dialog.Title>
      <Dialog.Description>编辑成员信息</Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-2">
      <Label class="mt-1">昵称</Label>
      <Input type="text" bind:value={userName} />
      {#if member.user}
        {#if currentUserRole() === BillRole.Owner}
          {#if roleEditAble()}
            <Label class="mt-1">权限</Label>
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
          {/if}
        {/if}
      {/if}
    </div>
    <Dialog.Footer class="flex justify-between">
      <Button variant="ghost" onclick={() => (editCardOpen = false)}
        >取消</Button
      >
      <Button variant="secondary" onclick={saveEdit}>保存</Button>
      <Button variant="destructive" onclick={removeMember}>删除</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<ShareCard
  bind:bill
  bind:open={shareCardOpen}
  showDetail={false}
  billMember={member}
/>

<Dialog.Root bind:open={bindCardOpen}>
  <Dialog.Content class="max-w-md">
    <Dialog.Header>
      <Dialog.Title>绑定成员</Dialog.Title>
      <Dialog.Description>将会以{member.name}作为成员</Dialog.Description>
    </Dialog.Header>
    <Button variant="outline" onclick={bindMember}>绑定</Button>
  </Dialog.Content>
</Dialog.Root>
