<script lang="ts">
  import SettingsNav from "$lib/components/settings/settings-nav.svelte";
  import { Separator } from "$lib/components/ui/separator";

  const items = [
    {
      title: "常规",
      href: "/app/settings/",
    },
    {
      title: "账户",
      href: "/app/settings/account/",
    },
    {
      title: "应用",
      href: "/app/settings/app/",
    },
  ];
</script>

<div class="p-3 md:p-10 md:pb-0 pb-0 w-full h-full flex flex-col">
  <div class="space-y-0.5">
    <h2 class="text-2xl font-bold">设置</h2>
    <p class="text-muted-foreground">
      管理应用的设置.在这里选择你的偏好, 账户和其他选项.
    </p>
  </div>
  <Separator class="my-3 md:my-6" />
  <div class="flex flex-col lg:flex-row gap-x-12 grow min-h-0">
    <aside class="lg:grow lg:max-w-60 flex flex-col">
      <SettingsNav {items} />
    </aside>
    <div class="flex-1 pb-40">
      <slot />
    </div>
  </div>
</div>

