import { isValidCron } from "cron-validator";
import SC from "node-schedule";
import * as CONVAR from "./constant";
import * as FS from "./file";
import * as FP from "./fp";
import * as NMSG from "./notifierorg";

let activeJobs = new Map();

const getDateRule = () => {
  const now = new Date();
  const startOfDay = new Date(now);
  const endOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  endOfDay.setHours(23, 59, 59, 999);
  return { start: startOfDay, end: endOfDay };
};

const updateJobSchedule = (id: any, newCronExpression: any) => {
  if (activeJobs.has(id)) {
    const job = activeJobs.get(id);
    job.reschedule(newCronExpression);
  }
};

const stopSpecificJob = (id: any, newConExp: any) => {
  if (activeJobs.has(id)) {
    activeJobs.get(id).cancel();
    updateJobSchedule(id, newConExp);
  }
};

export const createTasksToSchedule = ({ msg }: any) => {
  const getActiveIcon = FS.readFile({
    filePath: CONVAR.getConfigFilepath(),
    date: "",
  }).msg.filter(
    (element: { notifierstatus: boolean }) => element.notifierstatus,
  )[0].notificationicon;
  const SCrule = { ...getDateRule(), icon: getActiveIcon };
  const tasksToSchedule = msg[0].notifierlist
    .map(
      (
        element: { todo: string; status: string; hour: string },
        index: number,
      ) => {
        if (
          element.status.toLowerCase() === "active" ||
          element.status.toLowerCase() === "welcome"
        ) {
          return {
            ...SCrule,
            id: `rm_${index}`,
            name: `${element.status.toLowerCase() === `welcome` ? `welcomejob` : `job${++index}`}`,
            cron: isValidCron(
              `0 ${Number(element.hour.split(":")[1]) === 0 ? `0` : `*/${Number(element.hour.split(":")[1])}`} ${Number(element.hour.split(":")[0]) === 0 ? `*` : `*/${Number(element.hour.split(":")[0])}`} * * *`,
              { seconds: true },
            )
              ? `0 ${Number(element.hour.split(":")[1]) === 0 ? `0` : `*/${Number(element.hour.split(":")[1])}`} ${Number(element.hour.split(":")[0]) === 0 ? `*` : `*/${Number(element.hour.split(":")[0])}`} * * *`
              : "0 0 */2 * * *",
            status: element.status,
            todo: element.todo,
          };
        }
      },
    )
    .filter(Boolean);
  return tasksToSchedule;
};

export const stopSchedule = async () => {
  for (const key of activeJobs.keys()) {
    activeJobs.get(key).cancel();
    activeJobs.delete(key);
  }
  await SC.gracefulShutdown();
};

export const initScheduleJob = async ({ msg }: any) => {
  try {
    if (msg?.length > 0 && msg[0]?.notifiertoggle === "e") {
      const tasksToSchedule = createTasksToSchedule({ msg });
      await stopSchedule();
      if (tasksToSchedule.length === 0) {
        return;
      }
      tasksToSchedule.forEach(
        (task: {
          id: string;
          name: string;
          status: string;
          cron: SC.Spec;
          todo: string;
          icon: string;
        }) => {
          if (activeJobs.has(task.id)) {
            activeJobs.get(task.id).cancel();
            activeJobs.delete(task.id);
          }
          let start = FP.getSystemCpuLoad();
          const job = SC.scheduleJob(task.cron, async () => {
            const end = FP.getSystemCpuLoad();
            const idleDifference = end.idleMs - start.idleMs;
            const totalDifference = end.totalMs - start.totalMs;
            const cpuPercentage =
              100 - Math.floor((100 * idleDifference) / totalDifference);
            if (cpuPercentage > 10) {
              stopSpecificJob(task.id, task.cron);
            }
            try {
              await new Promise((resolve) =>
                NMSG.sendNotification(task.name, task.todo, task.icon),
              );
            } catch (error) {
              throw error;
            }

            start = end;
          });

          activeJobs.set(task.id, job);
        },
      );
    } else if (msg[0]?.notifiertoggle === "d") {
      await stopSchedule();
      FP.logger.info(
        `Schedule: Notification disabled. Please Enable notification and re-entre.`,
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      FP.logger.error(`Schedule Error: ${error?.message}`);
    } else {
      FP.logger.error(`Schedule Error: ${error}`);
    }
  }
};
