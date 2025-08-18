<script lang="ts">
  import { Button } from "$lib/components/ui/button";
</script>

<!--写一个首页，首先欢迎用户，提示用户添加第一个账单开始-->
<!--居中-->
<div class="flex flex-col items-center justify-center h-screen">
  <h1 class="text-4xl font-bold">欢迎使用</h1>
  <h1 class="text-4xl font-bold">SpendWhat</h1>
  <p class="mt-4 text-lg">添加您的第一个账单以开始使用</p>
  <div class="mt-8 ml-auto mr-auto">
    <Button class="w-3xs h-20" variant="outline" href="/app/bill/setup"
      >添加账单</Button
    >
  </div>
</div>
