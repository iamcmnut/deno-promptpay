import { PromptPay } from "https://deno.land/x/promptpay/mod.ts";

const promptpay = new PromptPay("0812095124", 50);
const base64Image = promptpay.generateBase64Data(); // Base64-encoded image
const base64Image300px = promptpay.generateBase64Data(300); // Base64-encoded image

base64Image300px.then((qr) => {
  console.log(qr);
});
