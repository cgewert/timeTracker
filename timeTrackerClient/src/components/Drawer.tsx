import { Box, Divider, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { AppStrings } from "../constants/appStrings";
import { Navigation } from "../constants/navigation";
import './Drawer.css';

export function Drawer(props: any) {
    const {handleDrawerToggle} = props;
    const location = useLocation().pathname;

    return (
        <>
            <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ my: 2 }}>
                    {AppStrings.title}
                </Typography>
                <Divider />
                <List sx={{overflow: "hidden"}}>
                    {Navigation.map((item: any) => (
                        <ListItem sx={{width: "100%"}} key={item} disablePadding className={location === "/" + item ? "active" : ""}>
                            <NavLink to={"/" + item}>
                            <ListItemButton sx={{ textAlign: 'center' }}>
                                <ListItemText primary={item}/>
                            </ListItemButton>
                            </NavLink>
                        </ListItem>
                    ))}
                    <Divider/>
                    <ListItem>
                        <ListItemText secondary={"Version " + AppStrings.version}/>
                    </ListItem>
                </List>
            </Box>
        </>
    )
}