<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index.js";
  import { showAlert } from "$lib/stores/alert-dialog-store";
  import { logout } from "$lib/stores/user-functions";
  export let data: { session: string };

  $: if (typeof window !== "undefined" && !data.session) {
    goto("/user/login");
  }

  function logoutUser(){
    logout();
    goto("/user/login");
    showAlert("成功", "您已退出登录");
  }
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
  <p>Cookie的值是: {data.session}</p>
  <Button onclick={logoutUser}>退出登录</Button>
</div>
