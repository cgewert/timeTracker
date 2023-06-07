import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Task } from "../models/tasks.ts";

export class Database {
  public static readonly DATABASE_NAME = "app.db";
  public static readonly TABLE_TASKS = "tasks";

  private _db: null | DB = null;

  public constructor() {
    // Open database connection
    this._db = new DB(Database.DATABASE_NAME);
    if (this._db === null) {
      console.error("Could not establish database connection!");
    }
    this.execute(Database.QUERY_CREATE_TABLES);
  }

  public execute(statement: string) {
    if (!this._db) console.log("Initialize db connection first!");

    console.log("Executing SQL: \n " + statement);
    this._db?.execute(statement);
  }

  public close() {
    this._db?.close();
  }

  public post_tasks(req: any, _res: any): number {
    if (!this._db) return -1;

    console.log(`Received: ${req.method} /TASKS`);
    const task: Task = req.body.task;
    const query = `
      INSERT INTO ${Database.TABLE_TASKS} (
        date,
        start_time,
        task,
        comment
      ) VALUES (
        '${task.taskDate}',
        '${task.taskTime}',
        '${task.taskDescription}',
        '${task.taskComment}'
      )
    `;
    this.execute(query);
    const rows = this._db?.query("SELECT last_insert_rowid()");

    return rows[0][0];
  }

  public delete_task(req: any, _res: any) {
    const taskID = req.params?.id;
    if (!taskID || taskID == 0) {
      throw new Error("Something bad happened! Could not delete task.");
    }
    console.log(`Received: ${req.method} /TASKS/${req.params.id}`);

    const query = `
      DELETE FROM ${Database.TABLE_TASKS}
      WHERE id = ${taskID}
    `;
    try {
      this.execute(query);
    } catch (ex: any) {
      throw new Error("Something bad happened! Could not delete task.");
    }

    let result = { msg: "Deleted task " + taskID };
    return result;
  }

  private checkTaskType(val: any): val is Task {
    return (
      "taskDate" in val &&
      "taskTime" in val &&
      "taskDescription" in val &&
      "taskComment" in val
    );
  }

  public update_task(req: any, _res: any) {
    const taskID = req.params?.id;
    if (!taskID || taskID == 0) {
      throw new Error("Something bad happened! Could not update task.");
    }
    console.log(`Received: ${req.method} /TASKS/${req.params.id}`);
    const body: Task = req.body;
    if (!this.checkTaskType(body)) {
      throw new Error("Body is not of type Task!");
    }

    const query = `
      UPDATE ${Database.TABLE_TASKS}
      SET 
        date = '${body.taskDate}',
        start_time = '${body.taskTime}', 
        task = '${body.taskDescription}', 
        comment = '${body.taskComment}'
      WHERE id = ${taskID}
    `;
    try {
      this.execute(query);
    } catch (ex: any) {
      throw new Error("Something bad happened! Could not update task.");
    }

    // Send task list for task date
    const query_tasklist = `SELECT * FROM ${Database.TABLE_TASKS} WHERE date = '${body.taskDate}' ORDER BY start_time;`;
    const taskList = new Array<Task>();
    for (const row of this._db?.query(query_tasklist)) {
      const [taskID, taskDate, taskTime, taskDescription, taskComment] = row;
      taskList.push({
        taskID: taskID as number,
        taskDate: taskDate as string,
        taskDescription: taskDescription as string,
        taskTime: taskTime as string,
        taskComment: taskComment as string,
      });
    }

    return taskList;
  }

  // Fetches all task entries ordered by date
  public get_tasks(req: any, _res: any): Array<Task> {
    console.log(`Received: ${req.method} /TASKS`);
    console.log(req.query?.selectedDate);
    const selectedDate = req.query?.selectedDate;
    // If no date was selected return an empty record
    if (!selectedDate) return [];
    const taskList = new Array<Task>();
    const query = `SELECT * FROM ${Database.TABLE_TASKS} WHERE date = '${selectedDate}' ORDER BY start_time;`;
    console.log("EXECUTING " + query);

    if (!this._db) return [];

    for (const row of this._db?.query(query)) {
      const [taskID, taskDate, taskTime, taskDescription, taskComment] = row;
      taskList.push({
        taskID: taskID as number,
        taskDate: taskDate as string,
        taskDescription: taskDescription as string,
        taskTime: taskTime as string,
        taskComment: taskComment as string,
      });
    }

    return taskList;
  }

  public static readonly QUERY_CREATE_TABLES = `
        CREATE TABLE IF NOT EXISTS ${this.TABLE_TASKS} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            start_time TEXT,
            task TEXT,
            comment TEXT
        );
    `;
}
