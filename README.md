# Deno PromptPay

Generate Thai PromptPay QR code string and Base64-encoded images in Deno.

## Getting started

```ts
import { PromptPay } from "https://deno.land/x/promptpay/mod.ts";

const promptpay = new PromptPay("0812345678", 1000);
const qrCodeString = promptpay.generate();
const base64Image = promptpay.generateBase64Data(); // Base64-encoded image
```

## Development

Run tests:

```bash
deno test
```
## Dependency
1. QR generator by [denorg/qrcode](https://github.com/denorg/qrcode)

## License
- MIT © Chonchanok MueangRuangWit