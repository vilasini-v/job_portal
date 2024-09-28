import { FaSignOutAlt  } from "react-icons/fa";
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from "react-router-dom";
import React from 'react';
import { IconContext } from "react-icons";
import { useNavigate } from "react-router-dom";
import {  signOut } from "firebase/auth";
import {auth} from '../firebase';

const Sidebar = ({sidebarList=[]}) => {
    const navigate = useNavigate();

    const handleLogout = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/signup");
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
    }
    return (
        <aside className="fixed left-0 z-40 w-60 h-full bg-blue-200">
            <div className="flex flex-col h-screen w-auto px-3 py-4">
                <IconContext.Provider value={{ size: '1.5em', color: '#000' }}>
                    <List>
                        {sidebarList.map((item, index) => (
                            <Link to={item.path} key={index} style={{ textDecoration: 'none' }}>
                                <ListItem button>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={<p className="text-lg">{item.text}</p>} />
                                </ListItem>
                            </Link>
                        ))}
                    </List>
                </IconContext.Provider>
                <div className="flex flex-col px-4 justify-end basis-4/5 gap-2">
                    <div className="flex flex-row gap-3 items-center w-36">
                        <button onClick={handleLogout} className="flex w-36 gap-6"><FaSignOutAlt size='1.5em'/><span className="text-lg">Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
            
        </aside>
    );
}

export default Sidebar;
