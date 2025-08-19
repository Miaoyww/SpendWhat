import type { languageCodes } from "./util";

export default {
  theme: "light",
  remoteUrl: "http://localhost:3000",
  language: "chi" as keyof typeof languageCodes,

  // 账单设置
  defaultCurrencies: ["CNY"],
  billTimeFormat: "YYYY-MM-DD" as "YYYY-MM-DD" | "YYYY/MM/DD",
  billEmojis: ["🍕", "🚗", "🎁", "👕"],
  autoJoinBill: true,

  // 客户端设置
  offlineMode: false,
  syncStrategy: "auto" as "auto" | "manual" | "wifi",
};
