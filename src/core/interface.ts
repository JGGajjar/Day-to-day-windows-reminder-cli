export interface todoItem {
  todo: string;
  status: string;
  hour: string;
}

export interface notifierData {
  notifierdate: string;
  notifierstatus: number;
  notifiertoggle: string;
  notifierlist: todoItem[];
  total: number;
}

export interface notifierConfig {
  notifierstatus: boolean;
  notifierdate: string;
  notificationicon: string;
}

export interface printNotificationTableRow {
  index: number;
  notification: string;
  status: string;
  date: string;
  duration: string;
}

export interface printNotificationConfigTableRow {
  index: number;
  path: string;
  status: string;
  date: string;
}

export type NOTIFICATION = notifierData[];

export type NOTIFICATIONCONFIG = notifierConfig[];
