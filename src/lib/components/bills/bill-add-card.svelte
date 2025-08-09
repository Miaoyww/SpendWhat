<script>
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Plus } from "lucide-svelte";
  import { showAlert } from "$lib/stores/alert-dialog-store";
  import { isLoggedIn } from "$lib/stores/user-functions";
  import { goto } from "$app/navigation";

  let title = $state("");

  function addBill() {
    if (!isLoggedIn) {
      goto("/user/login");
      showAlert("错误", "请先登录.");
      return;
    }

    if (title.length < 3) {
      showAlert("错误", "标题长度至少为3个字符.");
      return;
    }
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
