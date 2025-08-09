<script lang="ts">
  import axios from "axios";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  const API_URL = "http://localhost:3000/user/register";
  let userName = $state("");
  let password = $state("");

  function register() {
    const data = {
      username: $state.snapshot(userName),
      password: password,
    };

    axios
      .post(API_URL, data)
      .then((response) => {
        console.log("成功:", response.data);
      })
      .catch((error) => {
        console.error("错误:", error);
      });
  }
</script>

<Input placeholder="Username" type="text" bind:value={userName}></Input>
<Input placeholder="Password" type="password" bind:value={password}></Input>

<Button onclick={register}>Click me</Button>
<div>
  <p>Username: {userName}</p>
  <p>Password: {password}</p>
</div>
