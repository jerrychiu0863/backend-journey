import { input } from "@inquirer/prompts";
import * as fs from "fs";
import qr from "qr-image";

const url = await input({ message: "Enter your url" });
const svg_string = qr.imageSync(url);
var qr_svg = qr.image(url, { type: "svg" });
qr_svg.pipe(fs.createWriteStream("i_love_qr.png"));
// console.log(svg_string);

fs.appendFile("test.txt", `${url}\n`, (err) => {
  if (err) {
    console.error(err);
  } else {
    // done!
  }
});
