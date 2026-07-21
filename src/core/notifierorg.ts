import wnotifier from "node-notifier";
import * as FP from "./fp";
import * as BL from "./logic";

const notificationOptions = (oName: string, oMsg: string, oImg: string) => {
  return {
    name: oName,
    title: `${oName.toLowerCase() === `welcomejob` ? `Welcome` : `D2D`}`,
    message: `${oMsg}`,
    icon: oImg,
    sound: true,
    wait: true,
    withFallback: true,
    appName: `Reminder CLI`,
  };
};

export const sendNotification = (oName: string, oMsg: string, oImg: string) => {
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.DISPLAY &&
    process.platform !== "win32"
  ) {
    return;
  }
  wnotifier.notify(
    notificationOptions(oName, oMsg, oImg),
    function (error, response, metadata) {
      if (oName.toLowerCase() === `welcomejob`) {
        const initNotifierData = BL.initNotifierFilePipe("Done");
      }
      if (error) {
        FP.logger.error(`${error}`);
        return;
      } else {
        return true;
      }
    },
  );
};
