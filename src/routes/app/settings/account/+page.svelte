<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index.js";
  import { showAlert } from "$lib/stores/alert-dialog-store";
  import {
    currentUser,
    loginByCookie,
    logoutUser,
  } from "$lib/stores/user-store";
  import { NavigateTo } from "$lib/utils/navigating";
  import { onMount, setContext } from "svelte";
  import SettingCard from "$lib/components/settings/settings-card.svelte";
  import { Label } from "$lib/components/ui/label";
  import { cn } from "$lib/utils";
  import { Input } from "$lib/components/ui/input";
  import SettingsAccountCard from "$lib/components/settings/settings-account-card.svelte";
  import LoginForm from "$lib/components/account/login-form.svelte";
  import RegisterForm from "$lib/components/account/register-form.svelte";
  import { toast } from "svelte-sonner";

  const id = Math.trunc(Math.random() * Number.MAX_SAFE_INTEGER).toString();
  let dialogOpens = $state({
    isLoginDialogOpen: false,
    isRegisterDialogOpen: false,
  });

  setContext("dialogOpens", dialogOpens);

  onMount(async () => {
    if (!$currentUser) {
      let session = localStorage.getItem("session");
      $inspect(session);
      if (!session) return;
      await loginByCookie(session);
    }
  });

  function logout() {
    logoutUser();
    toast.success("成功退出登录");
  }
</script>

<div class="space-y-3 pb-10 lg:max-w-4xl">
  <div class="font-weight-bold text-xl font-bold">账号</div>
  {#if $currentUser}
    <div
      class={cn(
        "flex flex-col md:flex-row md:items-center justify-between border-1 rounded-md px-6 py-4 gap-3"
      )}
    >
      <div class="grid gap-2">
        <SettingsAccountCard
          title="用户名"
          description="用户名只能包含字母数字字符或单个连字符, 且不能以连字符开头或结尾."
        >
          <Input
            id="userName-{id}"
            type="text"
            bind:value={$currentUser.username}
          />
        </SettingsAccountCard>
        <Button variant="outline">保存</Button>
        <Button variant="outline" onclick={logout}>退出登录</Button>
      </div>
    </div>
  {:else}
    <div class="text-gray-500">请登录以查看和编辑您的帐户设置.</div>
    <Button
      onclick={() => {
        dialogOpens.isLoginDialogOpen = true;
      }}>立即登录</Button
    >
  {/if}
</div>

{#key dialogOpens.isLoginDialogOpen}
  <LoginForm bind:open={dialogOpens.isLoginDialogOpen} />
{/key}

{#key dialogOpens.isRegisterDialogOpen}
  <RegisterForm bind:open={dialogOpens.isRegisterDialogOpen} />
{/key}
