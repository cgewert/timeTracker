import './DayOverview.css';
import { Card, CardContent, Typography, CardActions, Button } from "@mui/material";
import { WorkingTimeCalculation } from '../helpers/TaskHelpers';
import { AppStrings } from '../constants/appStrings';

export function DayOverview(props: any) {
    const taskListState = props.taskListState;
    const selectedDateState = props.selectedDateState;
    const taskCount = taskListState.length;
    const workingTime = () => {
        return (
            <>
                <span>{WorkingTimeCalculation(taskListState)}</span>
            </>
        );
    };
    const handleExportClick = (_ev: React.MouseEvent<HTMLButtonElement>) => {
        // TODO: Get selected date and insert
        const date = selectedDateState;
        // Download JSON document programmatically
        const dataBlob = new Blob(
            [ JSON.stringify({
                date,
                tasks: taskListState
            }) ], { type: 'application/json' }
        );
        // Programatically download tasklist file
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tasklist_${date}`;
        a.click();
    }

    return (
        <>
            <div className="overview-wrapper">
                <Card variant="outlined">
                    <CardContent>
                    <Typography variant="h4" color="text.primary" gutterBottom align='center'>
                        Overall Time: {workingTime()}
                    </Typography>
                    <Typography align={'center'} variant="h5">{taskCount} Tasks entered.</Typography>
                    </CardContent>
                    <CardActions>
                        <Button title={AppStrings.tooltipExportTasklist} disabled={selectedDateState ? false : true} size="medium" onClick={handleExportClick}>Export file</Button>
                    </CardActions>
                </Card>
            </div>
        </>
    )
}