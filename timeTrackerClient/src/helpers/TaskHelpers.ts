import { Task } from "../../../server/models/tasks";

// Sorts tasks by time
export const TaskListSorter = (a: Task, b: Task) => {
  const timeA = Date.parse(`01.07.1970 ${a.taskTime}`);
  const timeB = Date.parse(`01.07.1970 ${b.taskTime}`);
  if (timeA == timeB) return 0;
  return timeA > timeB ? 1 : -1;
};

// Calculates sum of working time for all tasklist items
export const WorkingTimeCalculation = (tasks: Array<Task>) => {
  let sum = 0;
  const HOURS = 1;
  const MINUTES = 2;

  for (let i = 0; i < tasks.length - 1; i++) {
    const regExp = /^([0-2][0-9]+):([0-5][0-9])/;
    let b = regExp.exec(tasks[i + 1].taskTime);
    let a = regExp.exec(tasks[i].taskTime);
    let hoursA = (<unknown>a?.[HOURS]) as number;
    let hoursB = (<unknown>b?.[HOURS]) as number;
    let minutesA = (<unknown>a?.[MINUTES]) as number;
    let minutesB = (<unknown>b?.[MINUTES]) as number;
    hoursA = hoursA * 60;
    hoursB = hoursB * 60;
    const sumHours = hoursB - hoursA;
    const sumMinutes = minutesB - minutesA;
    sum += sumHours + sumMinutes;
  }

  const fullHours = Math.floor(sum / 60);
  const fullMinutes = sum % 60;
  return `${("0" + fullHours).slice(-2)}:${("0" + fullMinutes).slice(-2)}`;
};
