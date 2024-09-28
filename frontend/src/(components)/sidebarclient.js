import { FaUser, FaBriefcase, FaInbox, FaCog } from "react-icons/fa";
export const sidebarlistclient = [
    {
        text: 'Profile',
        icon: <FaUser />,
        path: '/client-profile',
    },
    {
        text: 'Jobs',
        icon: <FaBriefcase />,
        path: '/client-jobs',
    },
    {
        text: 'Messages',
        icon: <FaInbox />,
        path: '/',
    },
    {
        text: 'Settings',
        icon: <FaCog />,
        path: '/',
    }
];