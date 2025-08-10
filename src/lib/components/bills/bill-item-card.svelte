<script lang="ts">
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
  import type { BillItem } from "$lib/models/bill/bill-item";

  export let item: BillItem;
</script>

<Card class="w-full max-w-sm">
  <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
    <div class="flex items-center gap-2">
      <span class="text-xl">{item.type_icon}</span>
      <CardTitle class="text-lg font-medium">{item.type}</CardTitle>
    </div>
    <span class="text-lg font-bold">
      {item.amount.toFixed(2)} {item.currency}
    </span>
  </CardHeader>

  <CardContent>
    <CardDescription>{item.description}</CardDescription>
    <p class="text-sm text-muted-foreground mt-2">
      {new Date(item.occurred_time).toLocaleDateString()}
    </p>
  </CardContent>
</Card>