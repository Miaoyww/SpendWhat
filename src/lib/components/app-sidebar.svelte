<script>
  import { SettingsIcon, UserIcon, Search, SquarePlus  } from "lucide-svelte";

  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { goto } from "$app/navigation";
</script>

<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>SpendWhat</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton>
              <Button
                class="flex items-center sm:flex outline outline-offset-2"
                variant="ghost"
                size="sm"
                onclick={() => {
                  goto("/");
                }}
              >
                <SquarePlus />
                <span>添加新账单</span>
              </Button>
            </Sidebar.MenuButton>
            <Sidebar.MenuButton>
              <Button
                class="flex items-center sm:flex outline outline-offset-2"
                variant="ghost"
                size="sm"
              >
                <Search />
                <span>搜索账单</span>
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
