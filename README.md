
# 📒 SpendWhat

> A simple, elegant **expense sharing & tracking** web application.
>
> 前端部分,基于 [SvelteKit](https://kit.svelte.dev) + TypeScript + [Tauri](https://tauri.app/zh-cn/) 构建.

**对应服务端仓库 👉 [SpendWhat Server](https://github.com/GoldenEggs-Workshop/spend-what-server)**

~~I English very bad, I no know I spend what.~~

---

## ✨ 功能 Features

* 🧾 **多人账单**：创建账单，邀请成员一起记录消费
* 💰 **自动结算**：根据消费明细，自动计算每人应付金额
* 📊 **数据展示**：清晰的消费分布和统计
* 🌍 **多币种支持**：支持多种货币，适合跨国场景

---

## 🛠️ 技术栈 Tech Stack

* [SvelteKit](https://kit.svelte.dev) 
* [Tauri](https://tauri.app/zh-cn/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com)
* [pnpm](https://pnpm.io)

---

## 🚀 部署 Deployment

1. 拉取代码

   ```sh
   git clone https://github.com/GoldenEggs-Workshop/spend-what.git
   cd spend-what-web
   ```

2. 安装依赖

   ```sh
   pnpm install
   ```

3. 启动开发环境

   ```sh
   pnpm run dev
   ```

4. 构建生产环境

   ```sh
   pnpm run build
   pnpm run preview
   ```
5. Tauri 构建与运行

	```sh
	pnpm tauri build
	pnpm tauri dev
	```

---

## 📦 与服务端配合

**目前服务器暂未搭建**, 前端需配合后端 [`SpendWhat Server`](https://github.com/GoldenEggs-Workshop/spend-what-server) 一起运行。
部署时，请确保 **API 地址与端口**正确配置。

请至`/src/lib/utils/request.ts`处修改

---

## 🤝 贡献 Contributing

欢迎提交 Issue 或 Pull Request!
无论是Feature, Bug, 还是文档改进, 我们都非常感谢你的贡献。


---

## 📜 License

[MIT License](./LICENSE) © 2025 GoldenEggs Workshop


