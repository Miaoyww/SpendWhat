<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { currentBill } from "$lib/stores/bill-store";
  import BillMemberCard from "$lib/components/bills/bill-member.card.svelte";
  import { showAlert } from "$lib/stores/alert-dialog-store";
  import  Post  from "$lib/utils/request";
  import { BillMember } from "$lib/models/bill-member";
  import { toast } from "svelte-sonner";
  import { NavigateTo } from "$lib/utils/navigating";

  if (!$currentBill) {
    NavigateTo("/");
  }
  
  let newName = $state("");

  async function addMember() {
    if (!$currentBill) {
      showAlert("错误", "$currentBill为空");
      return;
    }
    if (!newName.trim()) {
      showAlert("提示", "请输入成员名字");
      return;
    }
    if ($currentBill.members.some((m) => m.name === newName.trim())) {
      showAlert("提示", "该成员已存在");
      return;
    }
    let data = {
      bill_id: $currentBill.id,
      name: newName,
    };
    await Post("/bill/member/add", data)
      .then(async (res) => {
        let responseData = await res.json();
        let newMember = new BillMember(responseData.name, responseData._id);
        $currentBill.members.push(newMember);
        toast.success("成员添加成功", {
          description: `已成功添加成员：${newMember.name}`,
        });
        newName = ""; // 清空输入框
        currentBill.update(() => $currentBill);
      })
      .catch((error) => {
        showAlert("错误", error.message || "网络错误");
      });
  }
</script>

<div class="p-6 space-y-6">
  <h1 class="text-2xl font-bold">账单成员管理</h1>

  <!-- 添加成员 -->
  <div class="flex gap-2">
    <Input placeholder="成员名字" bind:value={newName} />
    <Button onclick={addMember}>添加</Button>
  </div>

  <!-- 成员列表 -->
  {#if $currentBill}
    {#if $currentBill.members}
      {#each $currentBill.members as member (member.id)}
        <BillMemberCard {member} bill={$currentBill} />
      {/each}
    {:else}
      <p class="text-gray-500">暂无成员</p>
    {/if}
  {/if}
</div>
