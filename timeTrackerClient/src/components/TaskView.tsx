import { Task } from '../../../server/models/tasks';
import './TaskView.css';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TextField } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';
import { TaskListSorter } from '../helpers/TaskHelpers';
import { AppStrings } from '../constants/appStrings';
import { toast } from 'react-toastify';
import { AxiosInstance } from 'axios';
import { Backend } from '../constants/backend';

export function TaskView(props: any) {
    const taskListState: Array<Task> = props.taskListState;
    const http: AxiosInstance = props.http;
    const {setTaskListState} = props;
    const handleDeleteClick = (id: number) => {
      if(!confirm(AppStrings.promptDoYouReallyWantToDeleteTheTask) || id == 0) {
        // Deletion was canceled or task was not given an db entity
        return;
      }

      // Send delete task command to backend
      http.delete(`${Backend.Tasks}/${id}`)
            .then((_response: any) => {
                  // If no error occured : Delete task from state
                  let filteredTaskList = taskListState.filter((task, _idx, _newTaskList) => 
                    task.taskID != id
                  );
                  filteredTaskList = filteredTaskList.sort(TaskListSorter);
                  setTaskListState(filteredTaskList);
                  toast.success(AppStrings.snackbarMessageTaskDeleted);
            }, (error: any) => {
                console.error(AppStrings.errorCouldNotDeleteTask, error);
                toast.error(AppStrings.errorCouldNotDeleteTask);
            });
    };
    const handleEditClick = (id: number) => {
      // Get task object
      const task = taskListState.find((task, _idx, _) => task.taskID == id)
      // Edit copy of instance
      const time: HTMLInputElement|null = document.getElementById('taskTimeEdit' + id) as HTMLInputElement;
      const comment: HTMLInputElement|null = document.getElementById('taskCommentEdit' + id) as HTMLInputElement;
      const description: HTMLInputElement|null = document.getElementById('taskDescriptionEdit' + id) as HTMLInputElement;
      if(task) {
        task.taskComment = comment.value;
        task.taskTime = time.value;
        task.taskDescription = description.value;

        setTaskListState([]);
        // Submit edit to backend
        http.patch(`${Backend.Tasks}/${id}`, task)
          .then(response => {
            // Set new state
            const editedTaskList = response.data;
            setTaskListState(editedTaskList);
            toast.success(AppStrings.snackbarMessageTaskEdited);
          }, error => {
            console.log(AppStrings.errorCouldNotEditTask, ": ",  error);
            toast.error(AppStrings.errorCouldNotEditTask);
          });
        }
    };

    const TaskView = (task: Task, idx: number) => {
      return (
        <TableRow
          key={idx}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell scope="row" sx={{height: "120px"}}>
            <TextField id={'taskTimeEdit' + task.taskID} fullWidth type="time" 
                      variant="outlined" InputLabelProps={{ shrink: true }} sx={{margin: "15px 0"}}
                      defaultValue={task.taskTime}
            />
          </TableCell>
          <TableCell sx={{height: "120px"}}>
            <TextField id={'taskDescriptionEdit' + task.taskID} fullWidth type="text" variant="outlined"
                      sx={{margin: "15px 0"}} defaultValue={task.taskDescription}
            />
          </TableCell>
          <TableCell sx={{width: "350px", height: "120px"}}>
            <TextField id={'taskCommentEdit' + task.taskID} fullWidth type="text" variant="outlined"
                      sx={{margin: "15px 0"}} defaultValue={task.taskComment} multiline
            />
          </TableCell>
          <TableCell className='action-cell' sx={{
              display: 'flex',
              height: "120px" ,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <span title={AppStrings.tooltipEditTask} onClick={() => handleEditClick(task.taskID)}>
              <SaveIcon sx={{'&:hover': {color: 'darkblue', cursor: 'pointer'} }} fontSize={'large'} color='primary'/>
            </span>
            <span title={AppStrings.tooltipDeleteTask} onClick={() => handleDeleteClick(task.taskID)}>
              <DeleteForeverIcon sx={{'&:hover': {color: 'darkblue', cursor: 'pointer'} }} fontSize={'large'} color='primary'/>
            </span>
          </TableCell>
        </TableRow>
      )
    };

    return (
        <>
            <TableContainer sx={{margin: "30px 0"}}>
                <Table sx={{ minWidth: 650 }} size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Time</TableCell>
                      <TableCell>Task</TableCell>
                      <TableCell>Comment</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {taskListState.map(TaskView)}
                  </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}