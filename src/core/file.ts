import * as FS from "fs";
import * as CONVAR from "./constant";
import * as FP from "./fp";
import * as INTERFACE from "./interface";
import * as BL from "./logic";

export const writeFile = (wObj: {
  filePath: string;
  dataObj: INTERFACE.NOTIFICATION | INTERFACE.NOTIFICATIONCONFIG;
}) => {
  try {
    if ("notifierlist" in wObj.dataObj[0]) {
      wObj.dataObj[0]?.notifierlist.sort(
        (a, b) => (b.status === "Done" ? 1 : 0) - (a.status === "Done" ? 1 : 0),
      );
    }
    const stringData = JSON.stringify(wObj.dataObj, null, 2);
    FS.writeFileSync(wObj.filePath, stringData, {
      encoding: "utf8",
      flag: "w",
    });
    return {
      error: false,
      msg: `Done`,
    };
  } catch (error) {
    return {
      error: true,
      msg: `An unexpected error occurred.`,
    };
  }
};

export const readFile = (rObj: { filePath: string; date: string }) => {
  try {
    const rawData = FS.readFileSync(rObj.filePath, {
      encoding: "utf8",
      flag: "r",
    });
    const parsedData = JSON.parse(rawData);
    const readData =
      rObj.date?.trim().length > 0
        ? parsedData.filter(
            (fsobject: INTERFACE.notifierData) =>
              fsobject.notifierdate === rObj.date,
          )
        : parsedData;
    return {
      error: readData.length === 0 ? true : false,
      msg: readData,
    };
  } catch (error) {
    return {
      error: true,
      msg: `An unexpected error occurred.`,
    };
  }
};

export const updateFile = (rObj: { type: string; uData: any }) => {
  let updatedRfs = null;
  const rfs =
    rObj.type === "n" || rObj.type === "u"
      ? BL.getStoredData({ file: CONVAR.getFilepath(), date: FP.getfulldate() })
      : BL.getStoredData({ file: CONVAR.getConfigFilepath(), date: "" });
  if (rObj.type === "n" || rObj.type === "u") {
    rfs[0].notifierstatus === 0
      ? (rfs[0].notifierstatus = CONVAR.programConfig.get("processid"))
      : rfs[0].notifierstatus;
    if (rfs.length > 0) {
      rfs.forEach((element: INTERFACE.notifierData) => {
        if (element.notifierdate === rObj.uData[0].notifierdate) {
          rObj.type === "n"
            ? (element.notifierlist = [
                ...element.notifierlist,
                ...rObj.uData[0].notifierlist,
              ])
            : (element.notifierlist = rObj.uData[0].notifierlist);
        }
      });
    } else {
      rfs.push(rObj.uData[0]);
    }
    rfs[0].total = rfs[0].notifierlist.length;
    updatedRfs = rfs;
  } else if (rObj.type === "c") {
    const updatedConfigObj =
      rfs?.map((rcf: INTERFACE.notifierConfig) => {
        return { ...rcf, notifierstatus: false };
      }) || [];
    updatedConfigObj.push(rObj.uData[0]);
    updatedRfs = updatedConfigObj;
  }
  return {
    filePath:
      rObj.type === "n" || rObj.type === "u"
        ? CONVAR.getFilepath()
        : CONVAR.getConfigFilepath(),
    dataObj: updatedRfs,
  };
};
