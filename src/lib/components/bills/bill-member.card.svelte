<script lang="ts">
  import { BillMember } from "$lib/models/bill-member";
  import { ChevronRight, User } from "lucide-svelte";
  import { Button } from "../ui/button";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import api from "$lib/utils/request";
  import { currentBill } from "$lib/stores/bill-store";
  import { showAlert } from "$lib/stores/alert-dialog-store";
  import { Bill } from "$lib/models/bill";
  import ShareCard from "../dialog/share-card/share-card.svelte";
  import * as Avatar from "$lib/components/ui/avatar/index.js";

  let { member = $bindable<BillMember>(), bill = $bindable<Bill>() } = $props<{
    member: BillMember;
    bill: Bill;
  }>();

  let editCardOpen = $state(false);
  let shareCardOpen = $state(false);

  function startEdit() {
    //   if (!$currentBill) {
    //     return;
    //   }
    //   editIndex = index;
    //   editName = $currentBill.members[index].name;
    //   editUserId = $currentBill.members[index].id || "";
  }

  function saveEdit() {
    //   if (!$currentBill) {
    //     return;
    //   }
    //   if (editIndex === null) return;
    //   $currentBill.members[editIndex].name = editName;
    //   $currentBill.members[editIndex].id = editUserId;
    //   saveBill();
    //   editIndex = null;
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

  let roleOptions = [
    { value: "owner", label: "拥有者" },
    { value: "member", label: "成员" },
    { value: "observer", label: "游客" },
  ];

  let roleSelected = $state("observer");
  const roleTriggerContent = $derived(
    roleOptions.find((f) => f.value === roleSelected)?.label ?? "选择权限"
  );
</script>

<div class="flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow-md bg-white">
  <div class="flex items-center gap-3">
    <Avatar.Root>
      <Avatar.Fallback>{member.name.charAt(0)}</Avatar.Fallback>
    </Avatar.Root>
    <span class="text-base ml-1">{member.name}</span>
  </div>

  <div class="flex items-center gap-3">
    <div class="text-right">
      {#if !member.user}
        <Button
          variant="ghost"
          onclick={() => {
            shareCardOpen = true;
          }}>邀请</Button
        >
      {/if}
      <Button
        variant="ghost"
        onclick={() => {
          editCardOpen = true;
        }}
      >
        <ChevronRight />
      </Button>
    </div>
  </div>
</div>

<Dialog.Root bind:open={editCardOpen}>
  <Dialog.Content class="max-w-md">
    <Dialog.Header>
      <Dialog.Title>成员详情</Dialog.Title>
    </Dialog.Header>
    <Dialog.Footer class="flex justify-between">
      <Button variant="ghost" onclick={() => (editCardOpen = false)}
        >取消</Button
      >
      <Button variant="secondary" onclick={startEdit}>保存</Button>
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
