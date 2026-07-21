import * as CONVAR from "./core/constant";
import * as FP from "./core/fp";
import * as BL from "./core/logic";

const Program = BL.programPipe();

export const main = async () => {
  BL.rawFilesPipe();
  FP.drawBanner(CONVAR.bannerText());
  await Program.parseAsync(process.argv);
};
