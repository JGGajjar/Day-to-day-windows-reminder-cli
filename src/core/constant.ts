import path from "path";
import * as FP from "./fp";
import * as INTERFACE from "./interface";
import * as BL from "./logic";

const optsConfig = [
  { flags: "--nls, --list", description: "View your reminder item list." },
  { flags: "--ne, --enable", description: "Enable all reminder." },
  { flags: "--nd, --disable", description: "Disable all reminder." },
  {
    flags: "--nad, --add <items...>",
    description:
      'Add new reminder item(s) (each item separate by "|").\nex: [ Text{HH:MM ] -> "Todo1{01:00|Todo2{04:00|Todo3{02:00".\n',
    callback: BL.addNotificationData,
  },
  {
    flags: "--nus, --updatestatus <updatestatus...>",
    description:
      'Update reminder item(s) status(Active | Done).\nex: [ Item Index{Updated Status ] -> "1{Done|2{Done|3{Active" -> For Index check --nls option.\n',
    callback: BL.updateNotificationstatus,
  },
  {
    flags: "--nud, --updateduration <updateduration...>",
    description:
      'Update reminder item(s) duration(HH:MM).\nex: [ Index{HH:MM ] -> "1{00:30|2{02:40|3{04:09" -> For Index check --nls option.\n',
    callback: BL.updateNotificationduration,
  },
  {
    flags: "--nui, --updateiconimage <updateiconimage>",
    description: `Update reminder icon image [Allowed Extensions: '.jpg', '.jpeg', '.png'].\n`,
    callback: BL.updateNotificationIconimage,
  },
];

export const programConfig = new Map();
programConfig.set("name", "dn");
programConfig.set("bannertext", `D2D Reminder CLI`);
programConfig.set("command", "dn");
programConfig.set("version", "0.0.1");
programConfig.set("commanderOptions", optsConfig);
programConfig.set(
  "helptextaftererror",
  `Please check option and re-enter. check --help for additional information.`,
);
programConfig.set("fileName", "notification.json");
programConfig.set("ConfigFileName", "config.json");
programConfig.set("notificationIconPath", path.join(__dirname, "wns.png"));
programConfig.set("imageExtension", [".jpg", ".jpeg", ".png"]);
programConfig.set("welcomeHeadline", "Welcome to D2D Reminder CLI!");
programConfig.set("processid", process.pid);

export const bannerText = () => programConfig.get("bannertext");

export const getFilepath = () =>
  path.join(__dirname, programConfig.get("fileName"));

export const getConfigFilepath = () =>
  path.join(__dirname, programConfig.get("ConfigFileName"));

export const TODOITEM = (
  todo: string,
  status: string,
  hour: string,
): INTERFACE.todoItem => ({
  todo,
  status,
  hour,
});

export const NOTIFICATIONDATA = (
  notifierdate: string,
  notifierstatus: number,
  notifiertoggle: string,
  notifierlistObj: Array<INTERFACE.todoItem>,
  total: number,
): INTERFACE.notifierData => ({
  notifierdate,
  notifierstatus,
  notifiertoggle,
  notifierlist: [...notifierlistObj],
  total,
});

export const NOTIFICATIONCONFIGDATA = (
  notifierstatus: boolean,
  notifierdate: string,
  notificationicon: string,
): INTERFACE.notifierConfig => ({
  notifierstatus,
  notifierdate,
  notificationicon,
});

export const PRINTNOTIFICATIONTABLE = (
  index: number,
  notification: string,
  status: string,
  date: string,
  duration: string,
): INTERFACE.printNotificationTableRow => ({
  index,
  notification,
  status,
  date,
  duration,
});

export const PRINTNOTIFICATIONCONFIGTABLE = (
  index: number,
  path: string,
  status: string,
  date: string,
): INTERFACE.printNotificationConfigTableRow => ({
  index,
  path,
  status,
  date,
});

export const initConfigData = () => ({
  filePath: getConfigFilepath(),
  dataObj: [
    NOTIFICATIONCONFIGDATA(
      true,
      FP.getfulldate(),
      programConfig.get("notificationIconPath"),
    ),
  ],
});

export const initNotifierData = (status: string) => ({
  filePath: getFilepath(),
  dataObj: [
    NOTIFICATIONDATA(
      FP.getfulldate(),
      programConfig.get("processid"),
      "e",
      [
        {
          todo: programConfig.get("welcomeHeadline"),
          status: status.toLowerCase() === "welcome" ? "Welcome" : status,
          hour: "00:01",
        },
      ],
      1,
    ),
  ],
});

export const printNotificationTableColumns = () => {
  return [
    {
      name: "index",
      title: "Index",
      alignment: "center",
      color: "white",
      maxLen: 10,
    },
    {
      name: "notification",
      title: "Reminder Item(s)",
      alignment: "left",
      maxLen: 80,
    },
    {
      name: "status",
      title: "Reminder Status",
      alignment: "left",
      maxLen: 20,
    },
    {
      name: "date",
      title: "Date",
      alignment: "left",
      color: "white",
      maxLen: 10,
    },
    {
      name: "duration",
      title: "Notification Duration - 24-hour clock",
      alignment: "left",
      color: "white",
      maxLen: 40,
    },
  ];
};

export const printConfigTableColumns = () => {
  return [
    {
      name: "index",
      title: "Index",
      alignment: "center",
      color: "white",
      maxLen: 10,
    },
    {
      name: "path",
      title: "Notification Icon Path",
      alignment: "left",
      maxLen: 80,
    },
    {
      name: "status",
      title: "Status",
      alignment: "left",
      maxLen: 20,
    },
    {
      name: "date",
      title: "Date",
      alignment: "left",
      maxLen: 10,
    },
  ];
};
