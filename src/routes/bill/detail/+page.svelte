<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  // 读取查询参数 id
  let id: string | null = null;

  $: id = $page.url.searchParams.get('id');

  onMount(() => {
    if (id) {
      // TODO: 用 id 去请求账单数据
      console.log('当前账单ID:', id);
    }
  });
</script>

<h1>账单详情页</h1>
<p>账单ID: {id}</p>
