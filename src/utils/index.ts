/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.ts,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.ts'
 *     import { myUtil } from '../utils/index.ts'
 *
 *   also incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 *
 */

// https://news.ycombinator.com/item?id=36459276
export const objectKeys = Object.keys as <T>(obj: T) => Array<keyof T>;

export const isNumber = (char: string): boolean => {
  const maybeNum = Number(char);
  return Number.isInteger(maybeNum);
};

import { promises } from "fs";

export const writeToFile = async (data: string, filePath: string) => {
  try {
    // Use the writeFile function from fs.promises to write the string to the file
    await promises.writeFile(filePath, data);

    console.log("Data has been written to the file successfully!");
  } catch (err) {
    console.error("Error writing to file:", err);
  }
};
