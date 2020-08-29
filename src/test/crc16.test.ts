import {
  assertEquals,
} from "https://deno.land/std@0.65.0/testing/asserts.ts";

import { crc16 } from "../main/crc16.ts";

Deno.test("CRC16: test value", () => {
  const crc = crc16("Hi");
  const crcStr = crc.toString(16).toUpperCase();

  assertEquals(crcStr, "64E5");
});
