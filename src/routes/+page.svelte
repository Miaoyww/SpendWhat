<script lang="ts">
  import BillAddCard from "$lib/components/bills/bill-add-card.svelte";

</script>

<!--写一个首页，首先欢迎用户，提示用户添加第一个账单开始-->
<!--居中-->
<div class="flex flex-col items-center justify-center h-screen">
  <h1 class="text-4xl font-bold">欢迎使用SpendWhat</h1>
  <p class="mt-4 text-lg">添加您的第一个账单以开始使用</p>
  <!--像CHATGPT官网一样，自适应长度-->
  <div class="mt-8 w-4/5">
    <BillAddCard />
  </div>
</div>
