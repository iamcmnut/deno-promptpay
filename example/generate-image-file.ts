import { PromptPay } from "https://deno.land/x/promptpay/mod.ts";

const promptpay = new PromptPay("0812095124", 50);
const qrCodeString = promptpay.generatePromptPayQRImage((file, error) => {
  console.log(file);
});
