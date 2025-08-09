<script>
  import {
    SettingsIcon,
    UserIcon,
    Search,
    SquarePlus,
    Coins,
  } from "lucide-svelte";

  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { goto } from "$app/navigation";
</script>

<Sidebar.Root>
  <Sidebar.Header>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:!p-1.5">
          <a href="/" class="flex items-center gap-2 ml-3">
            <Coins size={18} />
            <span class="text-lg font-semibold">SpendWhat</span>
          </a>
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Header>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton>
              <Button
                class="flex items-center sm:flex outline outline-offset-2"
                variant="ghost"
                onclick={() => {
                  goto("/");
                }}
              >
                <SquarePlus />
                <span class="m-1 text-base">新账单</span>
              </Button>
            </Sidebar.MenuButton>
            <Sidebar.MenuButton>
              <Button
                class="flex items-center sm:flex outline outline-offset-2"
                variant="ghost"
              >
                <Search />
                <span class="m-1 text-base">搜索账单</span>
              </Button>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Separator />
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
  <Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <div style="float: left;">
          <Sidebar.MenuButton>
            <div style="display: flex; align-items: center;">
              <a href="/user" class="flex items-center">
                <UserIcon />
                <span class="ml-1">用户</span>
              </a>
            </div>
          </Sidebar.MenuButton>
        </div>
        <div style="float: right;">
          <Sidebar.MenuButton>
            <a href="/settings">
              <SettingsIcon />
            </a>
          </Sidebar.MenuButton>
        </div>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Footer>
</Sidebar.Root>
