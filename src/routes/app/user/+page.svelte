<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index.js";
  import { showAlert } from "$lib/stores/alert-dialog-store";
  import { currentUser, loginByCookie, logoutUser } from "$lib/stores/user-store";
  import { NavigateTo } from "$lib/utils/navigating";
  import { onMount } from "svelte";
  export let data: { session: string };
  
  
  onMount(async ()=>{
     let user = await loginByCookie(data.session);
     currentUser.set(user);
     if(!user){
      NavigateTo("/app/user/login");
     }
      
  
  });
  function logout(){
    logoutUser();
    goto("/app/user/login");
    showAlert("成功", "您已退出登录");
  }
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
  <p>Cookie的值是: {data.session}</p>
  <Button onclick={logout}>退出登录</Button>
</div>
