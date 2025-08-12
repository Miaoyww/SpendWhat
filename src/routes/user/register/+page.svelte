<script>
  import RegisterForm from "$lib/components/user/register-form.svelte";
  import { NavigateTo } from "$lib/utils/navigating";
  import { currentUser } from "$lib/stores/user-store";

  //如果已经登录，直接跳转至user
  currentUser.subscribe((user) => {
    if (user) {
      //如果已经登录，跳转到用户页面
      NavigateTo("/user");
    }
  });
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
  <RegisterForm />
</div>
