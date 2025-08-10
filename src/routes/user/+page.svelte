<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index.js";
  import { showAlert } from "$lib/stores/alert-dialog-store";
  import { logoutUser } from "$lib/stores/user-store";
  export let data: { session: string };

  //启动时尝试登录
  $: if (typeof window !== "undefined" && !data.session) {
    goto("/user/login");
  }

  function logout(){
    logoutUser();
    goto("/user/login");
    showAlert("成功", "您已退出登录");
  }
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
  <p>Cookie的值是: {data.session}</p>
  <Button onclick={logout}>退出登录</Button>
</div>
