import './TaskInput.css';
import { TextField, Fab, Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add'
import { AppStrings } from "../constants/appStrings";
import { Task } from '../../../server/models/tasks';
import { TaskListSorter } from '../helpers/TaskHelpers';
import { AxiosInstance } from 'axios';
import { toast } from 'react-toastify';
import { Backend } from '../constants/backend';

export function TaskInput(props: any) {
    const {taskListState, setTaskListState, setSelectedDateState} = props;
    const http: AxiosInstance = props.http;
    const selectedDateChanged = (ev: any) => {
        setTaskListState([]);
        const selectedDate = ev.target.value;
        setSelectedDateState(selectedDate);
        // When the selected date changes load the record from backend
        http.get(Backend.Tasks, {params: {selectedDate}})
            .then((response: any) => {
                  if(response.data !== taskListState) {
                    setTaskListState(response.data);
                  }
              }, (error: any) => {
                  console.error(AppStrings.errorWhileLoadingTaskList, error);
              }
            );
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const task: Task = {
            taskID: 0,
            taskDate: data.get('taskDate') as string,
            taskDescription: data.get('taskDescription') as string,
            taskTime: data.get('taskTime') as string,
            taskComment: data.get('taskComment') as string,
        };
        http.post(Backend.Tasks, {task})
        .then((response: any) => {
              const insertID: number = response.data;
              task.taskID = insertID;
          }, (error: any) => {
              console.error(AppStrings.errorCouldNotSaveTask, error);
          }
        );
        let newTaskList = [...taskListState, task];
        newTaskList = newTaskList.sort(TaskListSorter);
        setTaskListState(newTaskList);
        // Show user feedback
        toast.success(AppStrings.snackbarMessageTaskAdded);
    };

    return (
        <>
            <Box component="form" onSubmit={handleSubmit} sx={{margin: "20px 0"}}>
                <TextField name='taskDate' required fullWidth sx={{margin: "15px 0"}} 
                           label={AppStrings.selectDate} type="date" variant="outlined" 
                           InputLabelProps={{ shrink: true }} onChange={selectedDateChanged}
                />
                <TextField name='taskTime' required fullWidth 
                           label={AppStrings.enterTime} type="time" variant="outlined"
                           InputLabelProps={{ shrink: true }} sx={{margin: "15px 0"}}
                />
                <TextField name='taskDescription' required fullWidth 
                           label={AppStrings.enterTask} type="text" variant="outlined"
                           sx={{margin: "15px 0"}}
                />
                <TextField name='taskComment' fullWidth 
                           label={AppStrings.enterComment} type="text" variant="outlined"
                           sx={{margin: "15px 0"}} multiline
                />
                <div className='button-wrapper'>
                    <Fab type='submit' color="primary" sx={{margin: "5px"}} variant="extended">
                        <AddIcon sx={{ mr: 1 }} /> {AppStrings.addTask}
                    </Fab>
                </div>
            </Box>
        </>
    )
}