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
    description: `Add new reminder item(s). (each item separate by '|||')\n*Note: To prevent internal double quotes from breaking a string, you must wrap the text inside single quotes (' ').\n\n[ Text{HH:MM{'A' | 'T' ]\n'A'|'a' : To launch and run an executable command(s) using the Windows Command Prompt\n'T'|'t' : Notification reminder\n\nEx.:\n1) Notification reminder : \n>> dn --nad "Todo1{01:00{t|||Todo2{02:00"\n\n2) To launch and run an executable command(s) using the Windows Command Prompt:\n>> dn --nad "ipconfig /all & ping google.com & netstat -an{00:30{a|||(ipconfig && ping google.com) || echo 'Network setup failed'{02:00{a"\n`,
    callback: BL.addNotificationData,
  },
  {
    flags: "--nus, --updatestatus <updatestatus...>",
    description: `Update reminder item(s) status(Active | Done). (each item separate by '|||')\n\n[ Item index{Updated Status ] : For Item index check 'dn --nls' option.\n\nEx.: dn --nus "1{Done|||2{Done|||3{Active"\n`,
    callback: BL.updateNotificationstatus,
  },
  {
    flags: "--nud, --updateduration <updateduration...>",
    description: `Update reminder item(s) duration(HH:MM). (each item separate by '|||')\n\n[ Item index{HH:MM ] : For Item index check 'dn --nls' option.\n\nEx.: dn --nud "1{00:30|||2{02:40|||3{04:09"\n`,
    callback: BL.updateNotificationduration,
  },
  {
    flags: "--nut, --updatetype <updatetype...>",
    description: `Update reminder item(s) type( 'A' | 'T' ). (each item separate by '|||')\n\n[ Item index{type( 'A' | 'T' ) ] : For Item index check 'dn --nls' option.\n'A'|'a' : To launch and run an executable command(s) using the Windows Command Prompt\n'T'|'t' : Notification reminder\n\nEx.: dn --nut "1{A|||2{T|||3{T"\n`,
    callback: BL.updateNotificationtype,
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
  type: string,
): INTERFACE.todoItem => ({
  todo,
  status,
  hour,
  type,
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
  type: string,
  duration: string,
): INTERFACE.printNotificationTableRow => ({
  index,
  notification,
  status,
  type,
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
          type: "t",
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
      alignment: "center",
      maxLen: 10,
    },
    {
      name: "type",
      title: "Reminder Type",
      alignment: "center",
      color: "white",
      maxLen: 10,
    },
    {
      name: "duration",
      title: "Notification Duration (24-hour clock)",
      alignment: "center",
      color: "white",
      maxLen: 22,
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
      maxLen: 10,
    },
    {
      name: "date",
      title: "Date",
      alignment: "left",
      maxLen: 10,
    },
  ];
};
