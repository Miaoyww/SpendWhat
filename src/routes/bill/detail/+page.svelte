<script lang="ts">
  import { page } from "$app/state";
  import { billStore } from "$lib/stores/bill-store";

  // 读取查询参数 id
  let id: string | null = $state(null);

  $effect(() => {
    id = page.url.searchParams.get("id");
    if (id) {
      billStore.currentBill.set(billStore.getBillById(id));
    }
  });
</script>

<h1>账单详情页</h1>
<p>账单ID: {id}</p>
