<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Plus } from "lucide-svelte";
  import { showAlert } from "$lib/stores/alert-dialog-store";
  import { goto } from "$app/navigation";
  import { billStore } from "$lib/stores/bill-store";
  import { Bill } from "$lib/models/bill/bill";
  import { saveBillLocal, saveUserLocal } from "$lib/stores/data-store";
  import { NavigateTo } from "$lib/stores/navigating";
  import { currentUser } from "$lib/stores/user-store";
  import type { User } from "$lib/models/user";

  let title = $state("");
  let user: User | null = $state(null);
  currentUser.subscribe((value) => {
    user = value;
  });
  async function addBill() {
    if (!user) {
      showAlert("错误", "用户信息获取失败.");
      return;
    }
    if (title.length < 3) {
      showAlert("错误", "标题长度至少为3个字符.");
      return;
    }

    const newBill = new Bill(
      title,
      user,
      [user],
      [],
      new Date().toISOString(),
      new Date().toISOString()
    );
    await newBill.uploadToServer();
    user.addNewOwnBill(newBill);

    await saveUserLocal(user);
    await saveBillLocal(newBill);
    console.log("新账单已添加:", newBill);
    billStore.addBill(newBill);

    NavigateTo(`/bill/detail?id=${newBill.id}`);
  }
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>添加一个账单</Card.Title>
  </Card.Header>
  <!--自动宽度，填充全屏-->
  <Card.Content>
    <div class="grid gap-4">
      <div class="grid gap-2">
        <Label>标题</Label>
        <Input type="text" bind:value={title} required />
        <Label class="text-gray-500 mt-2 text-sm">标题长度至少为3个字符.</Label>
      </div>
    </div>
  </Card.Content>
  <Card.Footer>
    <Button
      class="sm:flex outline outline-offset-2 ml-auto"
      variant="ghost"
      size="sm"
      onclick={addBill}
    >
      <Plus />
    </Button>
  </Card.Footer>
</Card.Root>
