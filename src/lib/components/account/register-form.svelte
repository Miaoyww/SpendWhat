<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { showAlert } from "$lib/stores/alert-dialog-store";
  import { loginUser, registerUser } from "$lib/stores/user-store";
  import { NavigateTo } from "$lib/utils/navigating";
  import { sha256 } from "js-sha256";

  let userName = $state("");
  let password = $state("");
  const id = $props.id();

  async function register() {
    // 检查用户名和密码是否为空
    if (!userName || !password) {
      showAlert("错误", "用户名和密码不能为空");
      return;
    }
    // 用户名长度小于3
    if (userName.length < 3) {
      showAlert("错误", "用户名长度不能小于3个字符");
      return;
    }
    let isRegistered = await registerUser(
      $state.snapshot(userName),
      $state.snapshot(sha256(password))
    );

    if (isRegistered) {
      await loginUser($state.snapshot(userName), $state.snapshot(sha256(password)));
      // 注册成功，跳转到用户主页
      NavigateTo("/app/settings/account");
    }
  }
</script>

<Card.Root class="mx-auto w-full max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">注册</Card.Title>
    <Card.Description>请输入您的用户名和密码以注册</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="grid gap-4">
      <div class="grid gap-2">
        <Label for="userName-{id}">用户名</Label>
        <Input id="userName-{id}" type="text" bind:value={userName} required />
        <Label class="text-gray-500 mt-2 text-sm"
          >用户名只能包含字母数字字符或单个连字符, 且不能以连字符开头或结尾.</Label
        >
      </div>
      <div class="grid gap-2">
        <div class="flex items-center">
          <Label for="password-{id}">密码</Label>
        </div>
        <Input
          id="password-{id}"
          type="password"
          bind:value={password}
          required
        />
        <Label class="text-gray-500 mt-2 text-sm">
          密码长度至少为15个字符, 或者至少包含一个数字和一个小写字母的8个字符.
        </Label>
      </div>
      <Button type="submit" class="w-full" onclick={register}>注册</Button>
    </div>
    <div class="mt-4 text-center text-sm">
      已经有帐户?
      <a href="/app/user/login" class="underline"> 立即登录 </a>
    </div>
  </Card.Content>
</Card.Root>
