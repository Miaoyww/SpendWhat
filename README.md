# SpendWhat Web

powered by [`sv`](https://github.com/sveltejs/cli).

## 部署

1. 拉取代码

2. 使用`pnpm`安装依赖

    ```sh
    pnpm install
    ```
3. 在目录下新建`.env`文件, 添加`PUBLIC_API_URL`和`PUBLIC_API_PORT`，指向你的API服务地址.

    ```env
    PUBLIC_API_URL=http://your-api-url
    PUBLIC_API_PORT=your-api-port
    ```

4. 运行

    ```sh
    pnpm run dev
    ```