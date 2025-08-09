<script lang="ts">
  import { goto } from "$app/navigation";
  import { redirect } from "@sveltejs/kit";
  export let data: { session: string };

  $: if (typeof window !== "undefined" && !data.session) {
    goto("/user/login");
  }
</script>

<p>Cookie的值是: {data.session}</p>
