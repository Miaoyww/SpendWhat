<script lang="ts">
  import axios from "axios";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { login } from "$lib/stores/user-functions";
  import { showAlert } from "$lib/stores/alert-dialog-store";
  import { goto } from "$app/navigation";

  const API_URL = "http://localhost:3000/api/user/login";

  let userName = $state("");
  let password = $state("");

  const id = $props.id();

  async function loginUser() {
    const data = {
      username: $state.snapshot(userName),
      password: $state.snapshot(password),
    };
    if (!userName || !password) {
      showAlert("错误", "用户名和密码不能为空");
      return;
    }
    // 用户名长度小于3
    if (userName.length < 3) {
      showAlert("错误", "用户名长度不能小于3个字符");
      return;
    }
    let isLoggedIn = await login($state.snapshot(userName), $state.snapshot(password));
    if (isLoggedIn) {
      // 登录成功，跳转到首页
      goto("/user");
    }
  }
</script>

<Card.Root class="mx-auto w-full max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">欢迎回来</Card.Title>
    <Card.Description>请输入您的用户名以登录您的帐户</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="grid gap-4">
      <div class="grid gap-2">
        <Label for="email-{id}">用户名</Label>
        <Input id="email-{id}" type="email" bind:value={userName} required />
        <Label class="text-gray-500 mt-2 text-sm"
          >用户名只能包含字母数字字符或单个连字符, 且不能以连字符开头或结尾.</Label
        >
      </div>
      <div class="grid gap-2">
        <div class="flex items-center">
          <Label for="password-{id}">密码</Label>
          <a href="##" class="ml-auto inline-block text-sm underline">
            忘记密码?
          </a>
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
      <Button type="submit" class="w-full" onclick={loginUser}>登录</Button>
    </div>
    <div class="mt-4 text-center text-sm">
      还没有帐户?
      <a href="/user/register" class="underline"> 立即注册 </a>
    </div>
  </Card.Content>
</Card.Root>
