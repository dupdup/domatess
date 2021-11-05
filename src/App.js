import { useState } from "react";
import {
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseUnAuthed
} from "@react-firebase/auth";
import {
  AppBar,
  Avatar,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@material-ui/core";

import PageTodolist from "./pages/PageTodolist";
import PageLogin from "./pages/PageLogin";

import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <AppShell />
      <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
        <FirebaseAuthConsumer>
          <IfFirebaseAuthed>
            <PageTodolist />
          </IfFirebaseAuthed>
          <IfFirebaseUnAuthed>
            <PageLogin />
          </IfFirebaseUnAuthed>
        </FirebaseAuthConsumer>
      </div>
    </div>
  );
}

function AppShell() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = (firebase) => {
    handleClose();
    firebase.auth().signOut();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1, textAlign: "left" }}>
          Todo List
        </Typography>
        <IfFirebaseAuthed>
          {({ user, firebase }) => (
            <div>
              <Avatar
                alt={user.displayName}
                src={user.photoURL}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
              />
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleLogout(firebase)}>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          )}
        </IfFirebaseAuthed>
      </Toolbar>
    </AppBar>
  );
}
