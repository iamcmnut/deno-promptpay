# Deno PromptPay

Generate Thai PromptPay QR code string and Base64-encoded images in Deno.

[![Build Status](https://github.com/iamcmnut/deno-promptpay/workflows/Deno/badge.svg?branch=master)](https://github.com/iamcmnut/deno-promptpay/actions)
[![GitHub](https://img.shields.io/github/license/iamcmnut/deno-promptpay)](https://github.com/iamcmnut/deno-promptpay/blob/master/LICENSE)
[![Contributors](https://img.shields.io/github/contributors/iamcmnut/deno-promptpay)](https://github.com/iamcmnut/deno-promptpay/graphs/contributors)

## Getting started

```ts
import { PromptPay } from "https://deno.land/x/deno_promptpay/mod.ts";

const promptpay = new PromptPay("0812345678", 1000);
const qrCodeString = promptpay.generate();
const base64Image = promptpay.generateBase64Data(); // Base64-encoded image
const base64Image300px = promptpay.generateBase64Data(300); // Base64-encoded image 300x300px
base64Image300px.then((qr) => {
  console.log(qr);
});
```
## Example
```ts
import { PromptPay } from "https://deno.land/x/deno_promptpay/mod.ts";

const promptpay = new PromptPay("0812095124", 50);
const base64Image300px = promptpay.generateBase64Data(300); // Base64-encoded image

base64Image300px.then((qr) => {
  console.log(qr);
});
```
![QR code](https://github.com/iamcmnut/deno-promptpay/blob/master/img/promptpay-qr.png?raw=true)

## Development

Run tests:

```bash
deno test
```
## Dependency
1. QR generator by [denorg/qrcode](https://github.com/denorg/qrcode)

## License
- MIT © Chonchanok MueangRuangWit
