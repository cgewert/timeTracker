import { List, ListItem, ListItemText } from '@mui/material';
import './TaskSelection.css';

export function TaskSelection() {
    // TODO: get tasks from props
    const Tasks = [
        "Mit Mizu V RISING spielen",
        "Mit Mizu das neue Outlast Koop Spiel spielen",
        "Daily Meeting",
        "TASK-1234",
        "TASK-3456",
    ]

    return (
        <>
            <div className="selection-wrapper">
                <List sx={{border: "1px solid lightgray", borderRadius: "5px", padding: "10px"}}>
                    {Tasks.map((item, idx)=>{
                        return (
                            <ListItem disablePadding key={item + idx} sx={{
                                '& :hover': {backgroundColor: '#1976d2', color: 'white'}
                            }}>
                                <ListItemText sx={{ padding: "5px"}} primary={item} />
                            </ListItem>
                        )
                    })}
                </List>
            </div>
        </>
    );
}