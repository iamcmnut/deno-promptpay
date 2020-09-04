import { qrcode } from "https://deno.land/x/qrcode@v2.0.0/mod.ts";
import { Base64 } from "https://deno.land/x/bb64@1.1.0/mod.ts";

import { TargetMismatchError, NegativeAmountError } from "./error/index.ts";
import { crc16 } from "./crc16.ts";
import {
  F_01_VERSION,
  F_02_QR_TYPE,
  F_03_MERCHANT_INFO,
  F_04_COUNTRY_CODE,
  F_05_CURRENCY_CODE,
  F_06_AMOUNT,
  F_07_CHECKSUM,
  C_NATIONAL_ID,
  C_TELEPHONE,
  C_PHONE_PREFIX,
  C_QR_IMAGE_DEFAULT_SIZE,
} from "./constants.ts";

export class PromptPay {
  private accountType: string;
  private accountNumber: string;
  private digitCode: string;
  private amount: string;

  /**
   * Create PromptPay instance
   * @param target receive target allow phone number or national id
   * @param amount amount of money to be transfered
   */
  public constructor(target: string, amount: number) {
    this.accountType = this.accountTypeCheck(target);
    this.accountNumber = "";

    if (C_NATIONAL_ID === this.accountType) {
      this.accountNumber = this.convertToProperNationalID(target);
    } else {
      this.accountNumber = this.convertToProperPhoneNo(target);
    }

    if (amount < 0) {
      throw new NegativeAmountError();
    }

    amount = Math.round(amount * 100.0) / 100.0;
    this.amount = amount.toString();
    this.digitCode = this.amount.length.toString().padStart(2, "0");
  }

  /**
   * Generate PromptPay string
   * @return return PromptPay string
   */
  public generate(): string {
    let emvco = "";
    emvco += F_01_VERSION;
    emvco += F_02_QR_TYPE;
    emvco += F_03_MERCHANT_INFO.replace("${accountType}", this.accountType)
      .replace("${accountNumber}", this.accountNumber);
    emvco += F_04_COUNTRY_CODE;
    emvco += F_05_CURRENCY_CODE;
    emvco += F_06_AMOUNT.replace("${digitCode}", this.digitCode).replace(
      "${amount}",
      this.amount,
    );
    emvco += F_07_CHECKSUM.replace("${checksumHex}", "");

    const checksum = crc16(emvco).toString(16).toUpperCase();
    emvco += checksum;

    return emvco;
  }

  /**
   * Generate Base64 enconded image
   * @param size image size
   */
  public generateBase64Data(size: number = C_QR_IMAGE_DEFAULT_SIZE) {
    const promptpay = this.generate();
    return qrcode(promptpay, { size: size });
  }

  /**
   * Generate a PromptPay QR .gif file
   * @param callback forward filename
   */
  public async generatePromptPayQRImage(
    callback: (file: string | null, err: Error | null) => void,
  ): Promise<void> {
    const res = this.generateBase64Data();

    try {
      let filename: string = Date.now().toString() + ".gif";
      let base64 = await this.generateBase64Data();
      let base64String = "" + base64;
      base64String = base64String.replace(/^data:image\/gif;base64,/, "");
      const b64 = Base64.fromBase64String(base64String);
      new Base64(b64).toFile(filename);
      let fileStat = await Deno.stat(filename);

      if (fileStat) {
        callback(filename, null);
      } else {
        callback(null, new Error("Unexpected error."));
      }
    } catch (error) {
      callback(null, error);
    }

    // res.then((val1) => {
    //   let filename: string = Date.now().toString() + ".gif";
    //   let base64 = "" + val1;
    //   base64 = base64.replace(/^data:image\/gif;base64,/, "");

    //   try {
    //     const b64 = Base64.fromBase64String(base64);
    //     new Base64(b64).toFile(filename);

    //     // check image file is created
    //     Deno.stat(filename).then((val2) => {
    //       if (val2.isFile) {
    //         callback(filename, null);
    //       } else {
    //         callback(null, new Error("Unexpected error."));
    //       }
    //     }).catch((reason) => {
    //       callback(null, reason);
    //     });
    //   } catch (error) {
    //     callback(null, error);
    //   }
    // });
  }

  /**
     * Proper telephone number converter
     * @param originalPhoneNo original phone number
     * @return proper format like, 0066812345678
     */
  private convertToProperPhoneNo(originalPhoneNo: string): string {
    let newPhoneNo = originalPhoneNo.substring(1);
    newPhoneNo = C_PHONE_PREFIX + newPhoneNo;

    return newPhoneNo;
  }

  /**
     * Proper nationalID number converter
     * @param originalNationalID original national id
     * @return proper format like, 1-3212-44421-33-7 or 1321244421337
     */
  private convertToProperNationalID(originalNationalID: string): string {
    return originalNationalID.replace(/-/g, "");
  }

  private accountTypeCheck(accountTarget: string): string {
    let accType = "00";

    if (this.isNationalID(accountTarget)) {
      accType = C_NATIONAL_ID;
    } else if (this.isPhoneNumber(accountTarget)) {
      accType = C_TELEPHONE;
    } else {
      throw new TargetMismatchError();
    }

    return accType;
  }

  /**
     * Check is Thailand Citizen ID
     * @param accountNumber account number
     * @return true: if it is citizen number
     */
  private isNationalID(accountNumber: string): boolean {
    const minPattern = /[\d-]{13}/;
    const maxPattern = /[\d-]{17}/;
    const pattern = /^\d-?\d{4}-?\d{5}-?\d{2}-?\d$/;

    if (
      !minPattern.test(accountNumber) && !maxPattern.test(accountNumber)
    ) {
      return false;
    }

    return pattern.test(accountNumber);
  }

  /**
   * Check is Thailand phone number
   * @param accountNumber account number
   * @return true: if it is phone number
   */
  private isPhoneNumber(accountNumber: string): boolean {
    const pattern = /^\d{10}$/;

    return pattern.test(accountNumber);
  }
}
