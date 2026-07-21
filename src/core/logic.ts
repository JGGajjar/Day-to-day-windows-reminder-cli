import chokidar from "chokidar";
import { Command } from "commander";
import * as NFS from "fs";
import { error } from "node:console";
import * as PT from "./consoletable";
import * as CONVAR from "./constant";
import * as FS from "./file";
import * as FP from "./fp";
import * as INTERFACE from "./interface";
import * as SC from "./scheduleJob";

export const addNotificationData = (value: any, dummyPrevious: any) => {
  try {
    if (value?.trim().length === 0) throw error;

    const notificationInputTodoList = value
      .split("|")
      .map((datainpunt: string) => {
        return CONVAR.TODOITEM(
          datainpunt.split("{")[0],
          "Active",
          FP.isValidTime(datainpunt.split("{")[1])
            ? datainpunt.split("{")[1]
            : "02:00",
        );
      })
      .filter(Boolean);

    const notificationInputdata: INTERFACE.NOTIFICATION = [
      CONVAR.NOTIFICATIONDATA(
        FP.getfulldate(),
        CONVAR.programConfig.get("processid"),
        "e",
        notificationInputTodoList,
        notificationInputTodoList.length,
      ),
    ];

    return { error: false, msg: notificationInputdata };
  } catch (error) {
    return {
      error: true,
      msg: 'Invalid Data. Add new notifier items(separate todo by "|") [Todo Item{HH:MM] ex. Todo1{01:00|Todo2{04:00|Todo3{02:00 ...',
    };
  }
};

export const updateNotificationstatus = (value: any, dummyPrevious: any) => {
  try {
    if (value?.trim().length === 0) throw error;

    const getarginput = value.split("|");
    const genratedatafrominput = getarginput
      .map((datainpunt: string) => {
        if (datainpunt?.trim().length > 0) {
          let getspliteddata = datainpunt.split("{");
          if (["Active", "Done"].includes(getspliteddata[1])) {
            return {
              index: Number(getspliteddata[0]),
              status: getspliteddata[1],
            };
          } else {
            throw Error;
          }
        }
      })
      .filter(Boolean);
    const rfs = FS.readFile({
      filePath: CONVAR.getFilepath(),
      date: FP.getfulldate(),
    });
    if (!rfs.error && rfs.msg.length > 0) {
      genratedatafrominput.forEach(
        (item: { index: number; status: string }) => {
          rfs.msg[0]?.notifierlist.forEach(
            (d: { todo: string; status: string }, index: number) => {
              if (item.index <= rfs.msg[0]?.notifierlist.length) {
                let tempItem = item.index - 1;
                if (index === tempItem) {
                  rfs.msg[0].notifierlist[index].status = item.status;
                }
              } else {
                throw Error;
              }
            },
          );
        },
      );
    }
    return { error: false, msg: rfs.msg };
  } catch (err) {
    return {
      error: true,
      msg: "No Data found / Invalid data enter. Please check and re-enter status(Active | Done) [Item Index{Updated Status] ex. 1{Done|2{Done|3{Active ...",
    };
  }
};

export const updateNotificationduration = (value: any, dummyPrevious: any) => {
  try {
    if (value?.trim().length === 0) throw error;
    const getarginput = value.split("|");
    const genratedatafrominput = getarginput
      .map((datainpunt: string) => {
        if (datainpunt?.trim().length > 0) {
          let getspliteddata = datainpunt.split("{");
          if (getspliteddata[1].includes(":")) {
            return {
              index: Number(getspliteddata[0]),
              hour: FP.isValidTime(getspliteddata[1])
                ? getspliteddata[1]
                : "02:00",
            };
          } else {
            throw Error;
          }
        }
      })
      .filter(Boolean);
    const rfs = FS.readFile({
      filePath: CONVAR.getFilepath(),
      date: FP.getfulldate(),
    });
    if (!rfs.error && rfs.msg.length > 0) {
      genratedatafrominput.forEach((item: { index: number; hour: string }) => {
        rfs.msg[0]?.notifierlist.forEach(
          (
            d: { todo: string; status: string; hour: string },
            index: number,
          ) => {
            if (item.index <= rfs.msg[0]?.notifierlist.length) {
              let tempItem = item.index - 1;
              if (index === tempItem) {
                rfs.msg[0].notifierlist[index].hour = item.hour;
              }
            } else {
              throw Error;
            }
          },
        );
      });
    }
    return { error: false, msg: rfs.msg };
  } catch (err) {
    return {
      error: true,
      msg: "No Data found / Invalid data enter. Please check and re-enter duration(HH:MM) [Index{HH:MM] ex. 1{00:30|2{02:40|3{04:09 ...",
    };
  }
};

export const updateNotificationIconimage = (value: any, dummyPrevious: any) => {
  try {
    if (
      value?.trim().length === 0 ||
      !FP.fsValidation(value, CONVAR.programConfig.get("imageExtension"))
    )
      throw error;
    return {
      error: false,
      msg: value,
    };
  } catch (error) {
    return {
      error: true,
      msg: `Please check path / file extension ['.jpg', '.jpeg', '.png'] and re-enter.`,
    };
  }
};

const commander = (config: any) => {
  const ProgramObj = new Command();
  ProgramObj.name(config.get("name"));
  ProgramObj.version(config.get("version"));
  ProgramObj.command("dn");
  return ProgramObj;
};

const commanderOptions = (programObj: any) => {
  CONVAR.programConfig
    .get("commanderOptions")
    .forEach(
      (optionObj: { flags: any; description: any; callback?: Function }) => {
        if (optionObj.callback) {
          programObj.option(
            optionObj.flags,
            optionObj.description,
            optionObj.callback,
          );
        } else {
          programObj.option(optionObj.flags, optionObj.description);
        }
      },
    );
  return programObj;
};

const commanderAction = (programObj: any) => {
  programObj.action(() => {
    const getPidStatus =
      FS.readFile({ filePath: CONVAR.getFilepath(), date: FP.getfulldate() })
        .msg[0]?.notifierstatus === 0
        ? true
        : false;
    const options = programObj.opts();
    switch (true) {
      case options?.list:
        consoleDataList();
        if (!getPidStatus) {
          process.exit(0);
        }
        break;
      case options?.enable:
        toggleNotification("e");
        if (!getPidStatus) {
          process.exit(0);
        }
        break;
      case options?.disable:
        toggleNotification("d");
        if (!getPidStatus) {
          process.exit(0);
        }
        break;
      case typeof options?.add?.error === "boolean" && !options?.add?.error:
        updateFilePipe({
          type: "n",
          uData: options?.add?.msg,
        });
        consoleDataList("n");
        if (getPidStatus) {
          SC.initScheduleJob(
            FS.readFile({
              filePath: CONVAR.getFilepath(),
              date: FP.getfulldate(),
            }),
          );
        } else {
          process.exit(0);
        }
        break;
      case typeof options?.updatestatus?.error === "boolean" &&
        !options?.updatestatus?.error:
        updateFilePipe({
          type: "u",
          uData: options?.updatestatus?.msg,
        });
        consoleDataList("n");
        if (getPidStatus) {
          SC.initScheduleJob(
            FS.readFile({
              filePath: CONVAR.getFilepath(),
              date: FP.getfulldate(),
            }),
          );
        } else {
          process.exit(0);
        }
        break;
      case typeof options?.updateduration?.error === "boolean" &&
        !options?.updateduration?.error:
        updateFilePipe({
          type: "u",
          uData: options?.updateduration?.msg,
        });
        consoleDataList("n");
        if (getPidStatus) {
          SC.initScheduleJob(
            FS.readFile({
              filePath: CONVAR.getFilepath(),
              date: FP.getfulldate(),
            }),
          );
        } else {
          process.exit(0);
        }
        break;
      case typeof options?.updateiconimage?.error === "boolean" &&
        !options?.updateiconimage?.error:
        updateFilePipe({
          type: "c",
          uData: [
            CONVAR.NOTIFICATIONCONFIGDATA(
              true,
              FP.getfulldate(),
              options?.updateiconimage?.msg,
            ),
          ],
        });
        consoleDataList("c");
        if (getPidStatus) {
          SC.initScheduleJob(
            FS.readFile({
              filePath: CONVAR.getFilepath(),
              date: FP.getfulldate(),
            }),
          );
        } else {
          process.exit(0);
        }
        break;
      default:
        const rfsc = FS.readFile({
          filePath: CONVAR.getFilepath(),
          date: FP.getfulldate(),
        });
        if (rfsc.msg[0]?.notifierstatus === 0) {
          rfsc.msg[0].notifierstatus = CONVAR.programConfig.get("processid");
          FP.pipe(FS.writeFile)({
            filePath: CONVAR.getFilepath(),
            dataObj: rfsc.msg,
          });
          SC.initScheduleJob(
            FS.readFile({
              filePath: CONVAR.getFilepath(),
              date: FP.getfulldate(),
            }),
          );
        } else if (rfsc.msg[0]?.notifierstatus > 0) {
          SC.initScheduleJob(rfsc);
        } else {
          FP.logger.info(`${CONVAR.programConfig.get("helptextaftererror")}`);
          process.exit(0);
        }
    }
  });
  return programObj;
};

const commanderPostErrorHelp = (programObj: any) => {
  programObj.showHelpAfterError(CONVAR.programConfig.get("helptextaftererror"));
  return programObj;
};

export const getStoredData = (dObj: { file: string; date: string }) => {
  const readFile = FS.readFile({ filePath: dObj.file, date: dObj.date });
  if (!readFile.error) {
    return readFile.msg;
  }
};

export const programPipe = () =>
  FP.pipe(
    commander,
    commanderOptions,
    commanderAction,
    commanderPostErrorHelp,
  )(CONVAR.programConfig);

export const initConfigFilePipe = () =>
  FP.pipe(FS.writeFile)(CONVAR.initConfigData());

export const initNotifierFilePipe = (status: string) => {
  const rfs = FS.readFile({
    filePath: CONVAR.getFilepath(),
    date: FP.getfulldate(),
  });
  if (rfs.error || rfs.msg.length === 0) {
    FP.pipe(FS.writeFile)(CONVAR.initNotifierData(status));
  } else {
    rfs.msg[0]?.notifierlist.forEach((d: { todo: string; status: string }) => {
      if (d.status.toLowerCase() === "welcome") {
        d.status = status;
      }
    });
    FS.writeFile({ filePath: CONVAR.getFilepath(), dataObj: rfs.msg });
  }
};

export const updateFilePipe = (uObj: {
  type: string;
  uData: INTERFACE.NOTIFICATION | INTERFACE.NOTIFICATIONCONFIG;
}) =>
  FP.pipe(
    FS.updateFile,
    FS.writeFile,
  )({
    type: uObj.type,
    uData: uObj.uData,
  });

export const rawFilesPipe = () => {
  if (!NFS.existsSync(CONVAR.getFilepath())) {
    const initNotifierData = initNotifierFilePipe("Welcome");
  } else {
    const rfsc = FS.readFile({
      filePath: CONVAR.getFilepath(),
      date: FP.getfulldate(),
    });
    if (rfsc.msg.length === 0) {
      const initNotifierData = initNotifierFilePipe("Welcome");
    }
  }
  if (!NFS.existsSync(CONVAR.getConfigFilepath())) {
    const initConfigData = initConfigFilePipe();
  }
  chokidar
    .watch(
      [
        CONVAR.getFilepath().replace(/\\/g, "/"),
        CONVAR.getConfigFilepath().replace(/\\/g, "/"),
      ],
      {
        persistent: true,
      },
    )
    .on("change", (path) => {
      const { msg } = FS.readFile({
        filePath: CONVAR.getFilepath(),
        date: FP.getfulldate(),
      });

      FP.pipe(
        FS.readFile,
        SC.initScheduleJob,
      )({ filePath: CONVAR.getFilepath(), date: FP.getfulldate() });
    });
};

const consoleDataList = (tableName: string = "") => {
  switch (tableName) {
    case "n":
      FP.pipe(
        getStoredData,
        PT.notificationList,
      )({ file: CONVAR.getFilepath(), date: FP.getfulldate() });
      break;
    case "c":
      FP.pipe(
        getStoredData,
        PT.notificationConfigList,
      )({ file: CONVAR.getConfigFilepath(), date: "" });
      break;

    default:
      FP.pipe(
        getStoredData,
        PT.notificationList,
      )({ file: CONVAR.getFilepath(), date: FP.getfulldate() });
      FP.pipe(
        getStoredData,
        PT.notificationConfigList,
      )({ file: CONVAR.getConfigFilepath(), date: "" });
      break;
  }
};

const toggleNotification = (toggleAction: string = "e") => {
  const rfs = FS.readFile({
    filePath: CONVAR.getFilepath(),
    date: FP.getfulldate(),
  });
  switch (toggleAction) {
    case "d":
      rfs.msg[0].notifiertoggle = "d";
      FS.writeFile({ filePath: CONVAR.getFilepath(), dataObj: rfs.msg });
      SC.stopSchedule();
      FP.logger.info(`All item(s) reminder disabled.`);
      break;
    default:
      rfs.msg[0].notifiertoggle = "e";
      FS.writeFile({ filePath: CONVAR.getFilepath(), dataObj: rfs.msg });
      FP.pipe(
        SC.initScheduleJob,
        FP.logger.info(`All item(s) reminder enabled.`),
      )(
        FS.readFile({
          filePath: CONVAR.getFilepath(),
          date: FP.getfulldate(),
        }),
      );
      break;
  }
};

const handleShutdown = async (signal: string) => {
  const rfsData = FS.readFile({
    filePath: CONVAR.getFilepath(),
    date: FP.getfulldate(),
  });
  const updatedProcessdata = (dataObj: any) => {
    return {
      filePath: CONVAR.getFilepath(),
      dataObj: [{ ...dataObj.msg[0], notifierstatus: 0 }],
    };
  };
  if (rfsData.msg[0]?.notifierstatus === process.pid) {
    FP.pipe(
      FS.readFile,
      updatedProcessdata,
      FS.writeFile,
    )({ filePath: CONVAR.getFilepath(), date: FP.getfulldate() });
  }
  process.exit(0);
};

process.on("uncaughtException", (error) => {
  console.trace();
  const rfsData = FS.readFile({
    filePath: CONVAR.getFilepath(),
    date: FP.getfulldate(),
  });
  const updatedProcessdata = (dataObj: any) => {
    return {
      filePath: CONVAR.getFilepath(),
      dataObj: [{ ...dataObj.msg[0], notifierstatus: 0 }],
    };
  };
  if (rfsData?.msg[0]?.notifierstatus === process.pid) {
    FP.pipe(
      FS.readFile,
      updatedProcessdata,
      FS.writeFile,
    )({ filePath: CONVAR.getFilepath(), date: FP.getfulldate() });
  }
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  const rfsData = FS.readFile({
    filePath: CONVAR.getFilepath(),
    date: FP.getfulldate(),
  });
  const updatedProcessdata = (dataObj: any) => {
    return {
      filePath: CONVAR.getFilepath(),
      dataObj: [{ ...dataObj.msg[0], notifierstatus: 0 }],
    };
  };
  if (rfsData.msg[0]?.notifierstatus === process.pid) {
    FP.pipe(
      FS.readFile,
      updatedProcessdata,
      FS.writeFile,
    )({ filePath: CONVAR.getFilepath(), date: FP.getfulldate() });
  }
  process.exit(1);
});

process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));
