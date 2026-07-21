import { Table } from "console-table-printer";
import * as CONVAR from "./constant";
import * as FP from "./fp";
import * as INTERFACE from "./interface";
import chalk from "chalk";

const createTableObj = (tObj: {
  c: object;
  d: INTERFACE.NOTIFICATION | INTERFACE.NOTIFICATIONCONFIG;
}) => ({
  t: new Table(tObj.c),
  d: tObj.d,
});

const createNotificationRowObj = (tObj: {
  t: Table;
  d: INTERFACE.NOTIFICATION;
}) => {
  if (tObj.d.length > 0) {
    tObj.t.table.title = `Reminder List [ Notification status : ${tObj.d[0].notifiertoggle === "e" ? chalk.green(`Enable`) : chalk.red(`Disable`)} ]`;
    tObj.d[0].notifierlist.forEach(
      (d: { todo: string; status: string; hour: string }, index: number) => {
        tObj.t.addRow(
          CONVAR.PRINTNOTIFICATIONTABLE(
            ++index,
            d.todo,
            d.status,
            tObj.d[0].notifierdate,
            `Every ${d.hour} ${d.hour.includes(":") ? (Number(d.hour.split(":")[0]) === 0 ? "min" : "hour") : "."}.`,
          ),
          d.status.toLowerCase() === "active"
            ? { color: "red" }
            : { color: "green" },
        );
      },
    );
    tObj.t.printTable();
  }
};

const createNotificationConfigRowObj = (tObj: {
  t: Table;
  d: INTERFACE.NOTIFICATIONCONFIG;
}) => {
  if (tObj.d.length > 0) {
    tObj.d.sort(
      (a, b) => (b.notifierstatus ? 1 : 0) - (a.notifierstatus ? 1 : 0),
    );
    tObj.d.forEach((d: INTERFACE.notifierConfig, index: number) => {
      tObj.t.addRow(
        CONVAR.PRINTNOTIFICATIONCONFIGTABLE(
          ++index,
          d.notificationicon,
          d.notifierstatus ? "Active" : "Inactive",
          d.notifierdate,
        ),
        d.notifierstatus ? { color: "green" } : { color: "red" },
      );
    });
    tObj.t.printTable();
  }
};

export const notificationList = (printTableObj: INTERFACE.NOTIFICATION) => {
  try {
    FP.pipe(
      createTableObj,
      createNotificationRowObj,
    )({
      c: {
        columns: CONVAR.printNotificationTableColumns(),
      },
      d: printTableObj,
    });
  } catch (error) {
    FP.logger.info(
      `Table: No messages received for ${FP.getfulldate()}. Please add notification and re-entre.`,
    );
  }
};

export const notificationConfigList = (
  printTableObj: INTERFACE.NOTIFICATIONCONFIG,
) => {
  try {
    FP.pipe(
      createTableObj,
      createNotificationConfigRowObj,
    )({
      c: {
        title: "Notification Configuration",
        columns: CONVAR.printConfigTableColumns(),
      },
      d: printTableObj,
    });
  } catch (error) {
    FP.logger.info(
      `Table: No messages received for ${FP.getfulldate()}. Please add notification and re-entre.`,
    );
  }
};
