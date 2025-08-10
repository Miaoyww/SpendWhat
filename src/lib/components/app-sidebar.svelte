<script lang="ts">
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
  import { currentUser } from "$lib/stores/user-store";
  import { User } from "$lib/models/user";
  import { billStore } from "$lib/stores/bill-store";
  import type { Bill } from "$lib/models/bill/bill";
  import BillSideCard from "$lib/components/bills/bill-side-card.svelte";

  let user: User | null = $state(null);

  currentUser.subscribe((value) => {
    user = value;
  });

  let bills: Bill[] = $state([]);

  billStore.subscribe((value) => {
    bills = value;
  });
</script>

<Sidebar.Root>
  <Sidebar.Header>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:!p-1.5">
          <a href="/" class="flex items-center gap-2 ml-1">
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
            <!--上栏-->
            <div class="mb-6">
              <Sidebar.MenuButton>
                <Button
                  class="flex items-center sm:flex outline outline-offset-2"
                  variant="ghost"
                  onclick={() => {
                    goto("/");
                  }}
                >
                  <div class="flex -ml-3 items-center">
                    <SquarePlus />
                    <span class="text-base ml-2">新账单</span>
                  </div>
                </Button>
              </Sidebar.MenuButton>
              <Sidebar.MenuButton>
                <Button
                  class="flex items-center sm:flex outline outline-offset-2"
                  variant="ghost"
                >
                  <div class="flex -ml-3 items-center">
                    <Search />
                    <span class="text-base ml-2">搜索账单</span>
                  </div>
                </Button>
              </Sidebar.MenuButton>
            </div>

            <span class="ml-3 mb-2 font-medium text-base text-gray-600"
              >账单</span
            >
            {#if user}
              {#if bills}
                <ul>
                  {#each bills as item}
                    <BillSideCard billItem={item} />
                  {/each}
                </ul>
              {/if}
            {/if}
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
  <Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Separator class="my-2" />
        <div style="float: left;">
          <Sidebar.MenuButton>
            <div style="display: flex; align-items: center;">
              <a href="/user" class="flex items-center">
                <UserIcon />
                {#if user}
                  <span class="ml-1">{user.username}</span>
                {:else}
                  <span class="ml-1">请登录</span>
                {/if}
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
