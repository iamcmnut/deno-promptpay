import { PromptPay } from "https://deno.land/x/deno_promptpay/mod.ts";

const promptpay = new PromptPay("0812095124", 50);
const qrCodeString = promptpay.generate();

console.log(qrCodeString);