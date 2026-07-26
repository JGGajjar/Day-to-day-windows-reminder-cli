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
    tObj.t.table.title = `Date : ${chalk.hex("#ff8800").bold.inverse(" " + tObj.d[0].notifierdate + " ")}                                              Reminder List                                                   Status : ${tObj.d[0].notifiertoggle === "e" ? chalk.hex("#34C119").inverse(` Enable `) : chalk.hex("#D12F27").inverse(` Disable `)}`;
    tObj.d[0].notifierlist.sort(
      (a, b) => (b.status === "Done" ? 1 : 0) - (a.status === "Done" ? 1 : 0),
    );
    tObj.d[0].notifierlist.forEach((d: INTERFACE.todoItem, index: number) => {
      tObj.t.addRow(
        CONVAR.PRINTNOTIFICATIONTABLE(
          ++index,
          d.todo,
          chalk.inverse(
            d.status.toLowerCase() === "active" ||
              d.status.toLowerCase() === "welcome"
              ? chalk.hex("#D12F27")("  Active  ")
              : chalk.hex("#34C119")("   Done   "),
          ),
          d.type.toLowerCase() === "a"
            ? chalk.hex("#277CFB").inverse("   CMD    ")
            : chalk.hex("#FBA527").inverse("   NTFY   "),
          d.status.toLowerCase() === "done"
            ? chalk
                .hex("#34C119")
                .inverse.strikethrough(
                  `  Every ${d.hour} ${d.hour.includes(":") ? (Number(d.hour.split(":")[0]) === 0 ? "min" : "hrs") : "."}  `,
                )
            : `  Every ${d.hour} ${d.hour.includes(":") ? (Number(d.hour.split(":")[0]) === 0 ? "min" : "hrs") : "."}  `,
        ),
        d.status.toLowerCase() === "active" ||
          d.status.toLowerCase() === "welcome"
          ? { color: "red", separator: true }
          : { color: "green", separator: true },
      );
    });
    console.log("\n");
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
          chalk.inverse(
            d.notifierstatus
              ? chalk.hex("#34C119")("  Active  ")
              : chalk.hex("#D12F27")(" Inactive "),
          ),
          d.notifierdate,
        ),
        d.notifierstatus
          ? { color: "green", separator: true }
          : { color: "red", separator: true },
      );
    });
    console.log("\n");
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
        style: "fatBorder",
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
        style: "fatBorder",
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
