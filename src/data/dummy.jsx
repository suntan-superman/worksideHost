import React from 'react';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FiBarChart } from 'react-icons/fi';
import { BsCurrencyDollar, BsShield } from "react-icons/bs";
import {
	MdSupervisorAccount,
	MdDashboard,
	MdNotifications,
	MdAccountTree,
	MdRequestPage,
} from "react-icons/md";
import avatar from './avatar.jpg';
import avatar2 from './avatar2.jpg';
import avatar3 from './avatar3.png';
import avatar4 from './avatar4.jpg';

export const links = [
	{
		links: [
			{
				name: "dashboard",
				icon: <MdDashboard style={{ color: "green" }} size={24} />,
			},
			{
				name: "projects",
				icon: <MdAccountTree style={{ color: "green" }} size={24} />,
			},
			{
				name: "requests",
				icon: <MdRequestPage style={{ color: "green" }} size={24} />,
			},
			{
				name: "notifications",
				icon: <MdNotifications style={{ color: "green" }} size={24} />,
			},
			{
				name: "admin",
				icon: <MdSupervisorAccount style={{ color: "green" }} size={24} />,
			},
			{
				name: "scheduler",
				icon: <AiOutlineCalendar style={{ color: "green" }} size={24} />,
			},
		],
	},
];

export const chatData = [
  {
    image:
      avatar2,
    message: 'Roman Joined the Team!',
    desc: 'Congratulate him',
    time: '9:08 AM',
  },
  {
    image:
      avatar3,
    message: 'New message received',
    desc: 'Salma sent you new message',
    time: '11:56 AM',
  },
  {
    image:
      avatar4,
    message: 'New Payment received',
    desc: 'Check your earnings',
    time: '4:39 AM',
  },
  {
    image:
      avatar,
    message: 'Jolly completed tasks',
    desc: 'Assign her new tasks',
    time: '1:12 AM',
  },
];

export const themeColors = [
  {
    name: 'blue-theme',
    color: '#1A97F5',
  },
  {
    name: 'gray-theme',
    color: '#747679',
  },
  {
    name: 'green-theme',
    color: '#03C9D7',
  },
  {
    name: 'purple-theme',
    color: '#7352FF',
  },
  {
    name: 'red-theme',
    color: '#FF5C8E',
  },
  {
    name: 'indigo-theme',
    color: '#1E4DB7',
  },
  {
    color: '#FB9678',
    name: 'orange-theme',
  },
];

export const userProfileData = [
  {
    icon: <BsCurrencyDollar />,
    title: 'My Profile',
    desc: 'Account Settings',
    iconColor: '#03C9D7',
    iconBg: '#E5FAFB',
  },
  {
    icon: <BsShield />,
    title: 'My Inbox',
    desc: 'Messages & Emails',
    iconColor: 'rgb(0, 194, 146)',
    iconBg: 'rgb(235, 250, 242)',
  },
];

export const worksideData = [
  {
    icon: <FiBarChart />,
    amount: '84',
    percentage: '-4%',
    title: 'Active Projects',
    iconColor: 'red',
    iconBg: 'gray',
    pcColor: 'red-600',
  },
  {
    icon: <FiBarChart />,
    amount: '55',
    percentage: '+23%',
    title: 'Pending Projects',
    iconColor: '#101014',
    iconBg: 'red',
    pcColor: 'green-600',
  },
  {
    icon: <FiBarChart />,
    amount: '94',
    percentage: '+38%',
    title: 'Completed Projects',
    iconColor: 'red',
    iconBg: '#101014',
    pcColor: 'green-600',
  },
  {
    icon: <FiBarChart />,
    amount: '84',
    percentage: '-4%',
    title: 'Active Requests',
    iconColor: 'yellow',
    iconBg: 'green',
    pcColor: 'red-600',
  },
  {
    icon: <FiBarChart />,
    amount: '55',
    percentage: '+23%',
    title: 'Pending Requests',
    iconColor: 'rgb(255, 244, 229)',
    iconBg: 'rgb(254, 201, 15)',
    pcColor: 'green-600',
  },
  {
    icon: <FiBarChart />,
    amount: '94',
    percentage: '+38%',
    title: 'Completed Requests',
    iconColor: '#101014',
    iconBg: 'red',
    pcColor: 'green-600',
  },
  {
    icon: <FiBarChart />,
    amount: '84',
    percentage: '-4%',
    title: 'Active Suppliers',
    iconColor: 'red',
    iconBg: '#101014',
    pcColor: 'red-600',
  },
  {
    icon: <FiBarChart />,
    amount: '55',
    percentage: '+23%',
    title: 'Active MSA Suppliers',
    iconColor: 'yellow',
    iconBg: 'green',
    pcColor: 'green-600',
  },
  {
    icon: <FiBarChart />,
    amount: '94',
    percentage: '+38%',
    title: 'Active Open Suppliers',
    iconColor: 'rgb(255, 244, 229)',
    iconBg: 'rgb(254, 201, 15)',
    pcColor: 'green-600',
  },
];
