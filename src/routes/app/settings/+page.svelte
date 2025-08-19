<script lang="ts">
  import SettingCard from "$lib/components/settings/settings-card.svelte";
  import { Input } from "$lib/components/ui/input";
  import { Switch } from "$lib/components/ui/switch";
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
</script>

<div class="space-y-3 pb-10 lg:max-w-4xl">
  <div class="font-weight-bold text-xl font-bold">主题设置</div>
  <SettingCard let:id title="主题模式" description="浅色 / 深色 / 跟随系统">
    <Switch {id} />
  </SettingCard>

  <div class="font-weight-bold text-xl font-bold">语言设置</div>
  <SettingCard let:id title="选择语言" description="未来将会支持更多语言.">
    <Switch {id} />
  </SettingCard>

  <div class="font-weight-bold text-xl font-bold">账单设置</div>
  <SettingCard
    let:id
    title="常用货币"
    description="在这里选择你的常用货币, 可减少索引时间."
  >
    <Switch {id} />
  </SettingCard>
  <SettingCard
    let:id
    title="默认账单时间格式"
    description="设置默认的账单时间格式."
  >
    <Switch {id} />
  </SettingCard>
  <SettingCard
    let:id
    title="更多账单表情"
    description="添加更多默认表情, 以供创建账单时使用!"
  >
    <Switch {id} />
  </SettingCard>
  <SettingCard
    let:id
    title="自动加入账单"
    description="创建账单后, 是否默认将创建者加入成员."
  >
    <Switch {id} />
  </SettingCard>

  <div class="font-weight-bold text-xl font-bold">客户端设置</div>
  <SettingCard
    let:id
    title="离线模式"
    description="若启动离线模式, 所有账单信息均不会上传至服务器, 您需要自行保管数据."
  >
    <Switch {id} />
  </SettingCard>
  <SettingCard
    let:id
    title="数据同步策略"
    description="自动 / 手动 / Wi-Fi 下才同步. 若启用了离线模式, 该选项将被禁用."
  >
    <Switch {id} />
  </SettingCard>

  <SettingCard
    let:id
    title="导出/导入"
    description="将所有账单数据导出为Json."
  >
    <Switch {id} />
  </SettingCard>
</div>
