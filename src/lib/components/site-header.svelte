<script>
  import { Button } from "$lib/components/ui/button/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { Plus, Settings, SquareArrowOutUpRight } from "lucide-svelte";
  import SidebarTrigger from "$lib/components/ui/sidebar/sidebar-trigger.svelte";
  import { goto } from "$app/navigation";
</script>

<header
  class="h-(--header-height) group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear"
>
  <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
    <SidebarTrigger class="-ml-1" />
    <Separator
      orientation="vertical"
      class="mx-2 data-[orientation=vertical]:h-4"
    />
    <h1 class="text-base font-medium">10.5 大阪</h1>
    <div class="ml-auto flex items-center gap-2">
      <div class="grid grid-cols-3 gap-4">
        <div class="...">
          <Button
            variant="ghost"
            size="sm"
            class="sm:flex outline outline-offset-2"
            onclick={() => {
              goto("/bill/settings");
            }}
          >
            <Settings />
          </Button>
        </div>
        <div class="...">
          <Button
            variant="ghost"
            size="sm"
            class="sm:flex outline outline-offset-2"
          >
            <SquareArrowOutUpRight />
          </Button>
        </div>
        <div class="...">
          <Button
            variant="ghost"
            size="sm"
            class="sm:flex outline outline-offset-2"
          >
            <Plus />
          </Button>
        </div>
      </div>
    </div>
  </div>
</header>
