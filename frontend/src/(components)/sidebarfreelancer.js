import { FaUser, FaBriefcase, FaInbox, FaCog } from "react-icons/fa";

export const sidebarlistfree= [
    {
        text: 'Profile',
        icon: <FaUser />,
        path: '/freelancer-profile',
    },
    {
        text: 'Jobs',
        icon: <FaBriefcase />,
        path: '/freelancer-jobs',
    },
    {
        text:'Applied Jobs',
        icon:<FaBriefcase/>,
        path:'/applied-jobs',
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