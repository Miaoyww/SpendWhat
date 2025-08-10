<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import SiteHeader from "$lib/components/site-header.svelte";
  import MyAlertDialog from "$lib/components/MyAlertDialog.svelte";
  import { currentUser, loginByCookie } from "$lib/stores/user-store";
  import { getBillsByUserId } from "$lib/stores/data-store";
  import { billStore } from "$lib/stores/bill-store";
  import { onMount } from "svelte";
  const { data, children } = $props<{
    data: { session: string };
    children: any;
  }>();
  onMount(async () => {
    //启动时尝试登录

    await loginByCookie(data.session);
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Sidebar.Provider
  style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
  <AppSidebar />
  <Sidebar.Inset>
    <SiteHeader />
    <div class="flex flex-1 flex-col">
      <div class="@container/main flex flex-1 flex-col gap-2">
        <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div class="px-4 lg:px-6">
            <main>
              {@render children?.()}
            </main>
          </div>
        </div>
      </div>
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>

<MyAlertDialog />
