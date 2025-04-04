/* eslint-disable */
import { FiHome } from "react-icons/fi";
import {
	MdAccountTree,
	MdRequestPage,
	MdLocalShipping,
	MdSupervisorAccount,
} from "react-icons/md";
import { AiOutlineCalendar } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";

export const links = [
	{
		name: "dashboard",
		icon: <FiHome style={{ color: "green" }} size={24} />,
		type: "link",
	},
	{
		name: "projects",
		icon: <MdAccountTree style={{ color: "green" }} size={24} />,
		type: "link",
	},
	{
		name: "scheduler",
		icon: <AiOutlineCalendar style={{ color: "green" }} size={24} />,
		type: "link",
	},
	{
		type: "divider",
	},
	{
		name: "requests",
		icon: <MdRequestPage style={{ color: "green" }} size={24} />,
		type: "link",
	},
	{
		name: "logistics",
		icon: <MdLocalShipping style={{ color: "green" }} size={24} />,
		type: "link",
	},
	{
		name: "tracker",
		icon: <TbTruckDelivery style={{ color: "green" }} size={24} />,
		type: "link",
	},
	{
		type: "divider",
	},
	{
		name: "supplier",
		icon: <TbTruckDelivery style={{ color: "green" }} size={24} />,
		type: "link",
	},
	{
		name: "admin",
		icon: <MdSupervisorAccount style={{ color: "green" }} size={24} />,
		type: "link",
	},
]; 