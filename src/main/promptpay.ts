import { qrcode } from "https://deno.land/x/qrcode/mod.ts";

import { TargetMismatchError, NegativeAmountError } from "./error/index.ts";
import { crc16 } from "./crc16.ts";

export class PromptPay {
  private readonly F_01_VERSION = "000201";
  private readonly F_02_QR_TYPE = "010212";
  private readonly F_03_MERCHANT_INFO =
    "29370016A000000677010111${accountType}13${accountNumber}";
  private readonly F_04_COUNTRY_CODE = "5802TH";
  private readonly F_05_CURRENCY_CODE = "5303764";
  private readonly F_06_AMOUNT = "54${digitCode}${amount}";
  private readonly F_07_CHECKSUM = "6304${checksumHex}";
  private readonly C_CITIZEN = "02";
  private readonly C_TELEPHONE = "01";
  private readonly C_PHONE_PREFIX = "0066";
  private readonly C_QR_IMAGE_DEFAULT_SIZE = 250;
  private accountType: string;
  private accountNumber: string;
  private digitCode: string;
  private amount: string;

  public constructor(target: string, amount: number) {
    this.accountType = this.accountTypeCheck(target);
    this.accountNumber = "";

    if (this.C_CITIZEN === this.accountType) {
      this.accountNumber = target;
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

  public generate(): string {
    let emvco = "";
    emvco += this.F_01_VERSION;
    emvco += this.F_02_QR_TYPE;
    emvco += this.F_03_MERCHANT_INFO.replace("${accountType}", this.accountType)
      .replace("${accountNumber}", this.accountNumber);
    emvco += this.F_04_COUNTRY_CODE;
    emvco += this.F_05_CURRENCY_CODE;
    emvco += this.F_06_AMOUNT.replace("${digitCode}", this.digitCode).replace(
      "${amount}",
      this.amount,
    );
    emvco += this.F_07_CHECKSUM.replace("${checksumHex}", "");

    const checksum = crc16(emvco).toString(16).toUpperCase();
    emvco += checksum;

    return emvco;
  }

  public generateBase64Data() {
    const promptpay = this.generate();
    return qrcode(promptpay);
  }

  /**
     * Proper telephone number converter
     * @param originalPhoneNo original phone number
     * @return proper format like, 0066812345678
     */
  private convertToProperPhoneNo(originalPhoneNo: string): string {
    let newPhoneNo = originalPhoneNo.substring(1);
    newPhoneNo = this.C_PHONE_PREFIX + newPhoneNo;

    return newPhoneNo;
  }

  private accountTypeCheck(accountTarget: string): string {
    let accType = "00";

    if (this.isCitizenNumber(accountTarget)) {
      accType = "02";
    } else if (this.isPhoneNumber(accountTarget)) {
      accType = "01";
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
  private isCitizenNumber(accountNumber: string): boolean {
    const pattern = /^\d{13}$/; // "^\\d{13}$";

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
