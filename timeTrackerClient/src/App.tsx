import './App.css'
import {AppBar, Box, Container, CssBaseline,  Drawer, IconButton, Toolbar, Typography} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Drawer as DrawerContent} from './components/Drawer';
import { TaskInput } from './components/TaskInput';
import { TaskView } from './components/TaskView';
import { DayOverview } from './components/DayOverview';
import { AppStrings } from './constants/appStrings';
import { AxiosInstance } from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

function App(props: any) {
  const http: AxiosInstance = props.http;
  const container = window !== undefined ? () => document.body : undefined;
  const [selectedDateState, setSelectedDateState] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const [taskListState, setTaskListState] = useState([]);

  return (
    <>
      <CssBaseline />
      <ToastContainer autoClose={6000} pauseOnHover theme="light"/>
      <Container maxWidth="sm" sx={{
          width: "100vw",
          height: "100vh",
          display: 'flex', 
          justifyContent: 'center',
        }}>
        <Box sx={{ 
          bgcolor: 'background.paper', 
          height: '100vh',
          width: '1000px',
          borderLeft: '1px solid #d8d8d8',
          borderRight: '1px solid #d8d8d8',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }} >
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open menu"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {AppStrings.title}
              </Typography>
            </Toolbar>
          </AppBar>
          <Box component="nav">
            <Drawer container={container} variant="temporary"
                    open={mobileOpen} onClose={handleDrawerToggle}
                    ModalProps={{
                      keepMounted: true,
                    }}
                    sx={{
                      display: { lg: 'block' },
                      '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300 },
                    }}
            >
              <DrawerContent handleDrawerToggle={handleDrawerToggle}/>
            </Drawer>
          </Box>
          <Box component="main" sx={{
            overflow: 'hidden auto', 
            width: "100%",
            padding: "25px 25px",
          }}>
            <TaskInput taskListState={taskListState} setTaskListState={setTaskListState} http={http} 
                       setSelectedDateState={setSelectedDateState}/>
            <DayOverview taskListState={taskListState} selectedDateState={selectedDateState}/>
            <TaskView taskListState={taskListState} setTaskListState={setTaskListState} http={http}/>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default App
