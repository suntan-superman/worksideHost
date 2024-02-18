import React from 'react';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FiBarChart } from 'react-icons/fi';
import { BsBoxSeam, BsCurrencyDollar, BsShield, BsChatLeft } from 'react-icons/bs';
// import { IoMdContacts } from 'react-icons/io';
// import { RiContactsLine, RiStockLine } from 'react-icons/ri';
import { MdOutlineSupervisorAccount, MdOutlineCancel,
  MdHome, 
  MdSupervisorAccount,
  MdDashboard,
  MdNotifications,
  MdAccountTree,
  MdRequestPage,
  MdLocalShipping,
  MdAccessibility,
  MdConstruction,
  MdSettings } from 'react-icons/md';
import { HiOutlineRefresh } from 'react-icons/hi';
// import { TiTick } from 'react-icons/ti';
import { GrLocation } from 'react-icons/gr';
import avatar from './avatar.jpg';
import avatar2 from './avatar2.jpg';
import avatar3 from './avatar3.png';
import avatar4 from './avatar4.jpg';

export const gridOrderImage = (props) => (
  <div>
    <img
      className="rounded-xl h-20 md:ml-3"
      src={props.ProductImage}
      alt="order-item"
    />
  </div>
);

export const gridOrderStatus = (props) => (
  <button
    type="button"
    style={{ background: props.StatusBg }}
    className="text-white py-1 px-2 capitalize rounded-2xl text-md"
  >
    {props.Status}
  </button>
);

const gridEmployeeProfile = (props) => (
  <div className="flex items-center gap-2">
    <img
      className="rounded-full w-10 h-10"
      src={props.EmployeeImage}
      alt="employee"
    />
    <p>{props.Name}</p>
  </div>
);

const gridEmployeeCountry = (props) => (
  <div className="flex items-center justify-center gap-2">
    <GrLocation />
    <span>{props.Country}</span>
  </div>
);

const customerGridImage = (props) => (
  <div className="image flex gap-4">
    <img
      className="rounded-full w-10 h-10"
      src={props.CustomerImage}
      alt="employee"
    />
    <div>
      <p>{props.CustomerName}</p>
      <p>{props.CustomerEmail}</p>
    </div>
  </div>
);

const customerGridStatus = (props) => (
  <div className="flex gap-2 justify-center items-center text-gray-700 capitalize">
    <p style={{ background: props.StatusBg }} className="rounded-full h-3 w-3" />
    <p>{props.Status}</p>
  </div>
);
export const areaPrimaryXAxis = {
  valueType: 'DateTime',
  labelFormat: 'y',
  majorGridLines: { width: 0 },
  intervalType: 'Years',
  edgeLabelPlacement: 'Shift',
  labelStyle: { color: 'gray' },
};

export const areaPrimaryYAxis = {
  labelFormat: '{value}%',
  lineStyle: { width: 0 },
  maximum: 4,
  interval: 1,
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  labelStyle: { color: 'gray' },

};
export const barPrimaryXAxis = {
  valueType: 'Category',
  interval: 1,
  majorGridLines: { width: 0 },
};
export const barPrimaryYAxis = {
  majorGridLines: { width: 0 },
  majorTickLines: { width: 0 },
  lineStyle: { width: 0 },
  labelStyle: { color: 'transparent' },
};
export const colorMappingData = [
  [
    { x: 'Jan', y: 6.96 },
    { x: 'Feb', y: 8.9 },
    { x: 'Mar', y: 12 },
    { x: 'Apr', y: 17.5 },
    { x: 'May', y: 22.1 },
    { x: 'June', y: 25 },
    { x: 'July', y: 29.4 },
    { x: 'Aug', y: 29.6 },
    { x: 'Sep', y: 25.8 },
    { x: 'Oct', y: 21.1 },
    { x: 'Nov', y: 15.5 },
    { x: 'Dec', y: 9.9 },
  ],
  ['#FFFF99'],
  ['#FFA500'],
  ['#FF4040'],
];

export const rangeColorMapping = [
  { label: '1°C to 10°C',
    start: '1',
    end: '10',
    colors: colorMappingData[1] },

  { label: '11°C to 20°C',
    start: '11',
    end: '20',
    colors: colorMappingData[2] },

  { label: '21°C to 30°C',
    start: '21',
    end: '30',
    colors: colorMappingData[3] },

];

export const ColorMappingPrimaryXAxis = {
  valueType: 'Category',
  majorGridLines: { width: 0 },
  title: 'Months',
};

export const ColorMappingPrimaryYAxis = {
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  labelFormat: '{value}°C',
  title: 'Temperature',
};

export const customersGrid = [
  { type: 'checkbox', width: '50' },
  { headerText: 'Name',
    width: '150',
    template: customerGridImage,
    textAlign: 'Center' },
  { field: 'ProjectName',
    headerText: 'Project Name',
    width: '150',
    textAlign: 'Center' },
  { field: 'Status',
    headerText: 'Status',
    width: '130',
    format: 'yMd',
    textAlign: 'Center',
    template: customerGridStatus },
  {
    field: 'Weeks',
    headerText: 'Weeks',
    width: '100',
    format: 'C2',
    textAlign: 'Center' },
  { field: 'Budget',
    headerText: 'Budget',
    width: '100',
    format: 'yMd',
    textAlign: 'Center' },

  { field: 'Location',
    headerText: 'Location',
    width: '150',
    textAlign: 'Center' },

  { field: 'CustomerID',
    headerText: 'Customer ID',
    width: '120',
    textAlign: 'Center',
    isPrimaryKey: true,
  },

];

export const employeesGrid = [
  { headerText: 'Employee',
    width: '150',
    template: gridEmployeeProfile,
    textAlign: 'Center' },
  { field: 'Name',
    headerText: '',
    width: '0',
    textAlign: 'Center',
  },
  { field: 'Title',
    headerText: 'Designation',
    width: '170',
    textAlign: 'Center',
  },
  { headerText: 'Country',
    width: '120',
    textAlign: 'Center',
    template: gridEmployeeCountry },

  { field: 'HireDate',
    headerText: 'Hire Date',
    width: '135',
    format: 'yMd',
    textAlign: 'Center' },

  { field: 'ReportsTo',
    headerText: 'Reports To',
    width: '120',
    textAlign: 'Center' },
  { field: 'EmployeeID',
    headerText: 'Employee ID',
    width: '125',
    textAlign: 'Center' },
];

export const customers = [
  {
    custID: 1,
    custName: 'Aera Energy',
  },
  {
    custID: 2,
    custName: 'Berry Petroleum',
  },
  {
    custID: 3,
    custName: 'Chevron',
  },
  {
    custID: 4,
    custName: 'CRC',
  },
];

export const projects = [
  {
    projectID: 102,
    projectName: 'Vinet',
    custName: 'Aera',
    custID: 1,
    custContactID: 1,
    rigCompanyID: 1,
    locationLatitude: 35.393528,
    locationLongitude: -119.043732,
    projectedStartDate: '2023-08-15',
    actualStartDate: '2023-08-15',
    expectedDuration: 1.5,
    actualDuration: 0.0,
    status: 'pending',
    statusDate: '2023-08-15',
    comment: '',
  },
  {
    projectID: 103,
    projectName: 'Bugsy',
    custName: 'Aera',
    custID: 1,
    custContactID: 1,
    rigCompanyID: 1,
    locationLatitude: 35.393528,
    locationLongitude: -119.043732,
    projectedStartDate: '2023-08-15',
    actualStartDate: '2023-08-15',
    expectedDuration: 1.5,
    actualDuration: 0.0,
    status: 'pending',
    statusDate: '2023-08-15',
    comment: '',
  },
  {
    projectID: 104,
    projectName: 'Allen',
    custName: 'Aera',
    custID: 1,
    custContactID: 1,
    rigCompanyID: 1,
    locationLatitude: 35.393528,
    locationLongitude: -119.043732,
    projectedStartDate: '2023-08-15',
    actualStartDate: '2023-08-15',
    expectedDuration: 1.5,
    actualDuration: 0.0,
    status: 'pending',
    statusDate: '2023-08-15',
    comment: '',
  },
];

export const links = [
  {
    links: [
      {
        name: 'dashboard',
        icon: <MdDashboard />,
      },
      {
        name: 'projects',
        icon: <MdAccountTree />,
      },
      {
        name: 'requests',
        icon: <MdRequestPage />,
      },
      {
        name: 'notifications',
        icon: <MdNotifications />,
      },
      // {
      //   name: 'rigs',
      //   icon: <MdConstruction />,
      // },
      // {
      //   name: 'suppliers',
      //   icon: <MdLocalShipping />,
      // },
      // {
      //   name: 'products',
      //   icon: <MdCleaningServices />,
      // },
      {
        name: 'admin',
        icon: <MdSupervisorAccount />,
      },
      {
        name: 'scheduler',
        icon: <AiOutlineCalendar />,
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

export const projectsGrid = [
  {
    field: 'projectID',
    headerText: 'ID',
    width: '20',
    textAlign: 'Center',
  },
  { field: 'projectName',
    headerText: 'Project',
    width: '75',
    textAlign: 'Center',
  },
  {
    field: 'location',
    headerText: 'Location',
    format: 'C2',
    textAlign: 'Center',
    width: '75',
  },
  {
    field: 'status',
    headerText: 'Status',
    textAlign: 'Center',
    width: '50',
  },
  {
    field: 'statusDate',
    headerText: 'Status Date',
    width: '100',
    textAlign: 'Center',
  },
];

export const scheduleData = [
  {
    Id: 1,
    Subject: 'Explosion of Betelgeuse Star',
    Location: 'Space Center USA',
    StartTime: '2021-01-10T04:00:00.000Z',
    EndTime: '2021-01-10T05:30:00.000Z',
    CategoryColor: '#1aaa55',
  },
  {
    Id: 2,
    Subject: 'Thule Air Crash Report',
    Location: 'Newyork City',
    StartTime: '2021-01-11T06:30:00.000Z',
    EndTime: '2021-01-11T08:30:00.000Z',
    CategoryColor: '#357cd2',
  },
  {
    Id: 3,
    Subject: 'Blue Moon Eclipse',
    Location: 'Space Center USA',
    StartTime: '2021-01-12T04:00:00.000Z',
    EndTime: '2021-01-12T05:30:00.000Z',
    CategoryColor: '#7fa900',
  },
  {
    Id: 4,
    Subject: 'Meteor Showers in 2021',
    Location: 'Space Center USA',
    StartTime: '2021-01-13T07:30:00.000Z',
    EndTime: '2021-01-13T09:00:00.000Z',
    CategoryColor: '#ea7a57',
  },
  {
    Id: 5,
    Subject: 'Milky Way as Melting pot',
    Location: 'Space Center USA',
    StartTime: '2021-01-14T06:30:00.000Z',
    EndTime: '2021-01-14T08:30:00.000Z',
    CategoryColor: '#00bdae',
  },
  {
    Id: 6,
    Subject: 'Mysteries of Bermuda Triangle',
    Location: 'Bermuda',
    StartTime: '2021-01-14T04:00:00.000Z',
    EndTime: '2021-01-14T05:30:00.000Z',
    CategoryColor: '#f57f17',
  },
  {
    Id: 7,
    Subject: 'Glaciers and Snowflakes',
    Location: 'Himalayas',
    StartTime: '2021-01-15T05:30:00.000Z',
    EndTime: '2021-01-15T07:00:00.000Z',
    CategoryColor: '#1aaa55',
  },
  {
    Id: 8,
    Subject: 'Life on Mars',
    Location: 'Space Center USA',
    StartTime: '2021-01-16T03:30:00.000Z',
    EndTime: '2021-01-16T04:30:00.000Z',
    CategoryColor: '#357cd2',
  },
  {
    Id: 9,
    Subject: 'Alien Civilization',
    Location: 'Space Center USA',
    StartTime: '2021-01-18T05:30:00.000Z',
    EndTime: '2021-01-18T07:30:00.000Z',
    CategoryColor: '#7fa900',
  },
  {
    Id: 10,
    Subject: 'Wildlife Galleries',
    Location: 'Africa',
    StartTime: '2021-01-20T05:30:00.000Z',
    EndTime: '2021-01-20T07:30:00.000Z',
    CategoryColor: '#ea7a57',
  },
  {
    Id: 11,
    Subject: 'Best Photography 2021',
    Location: 'London',
    StartTime: '2021-01-21T04:00:00.000Z',
    EndTime: '2021-01-21T05:30:00.000Z',
    CategoryColor: '#00bdae',
  },
  {
    Id: 12,
    Subject: 'Smarter Puppies',
    Location: 'Sweden',
    StartTime: '2021-01-08T04:30:00.000Z',
    EndTime: '2021-01-08T06:00:00.000Z',
    CategoryColor: '#f57f17',
  },
  {
    Id: 13,
    Subject: 'Myths of Andromeda Galaxy',
    Location: 'Space Center USA',
    StartTime: '2021-01-06T05:00:00.000Z',
    EndTime: '2021-01-06T07:00:00.000Z',
    CategoryColor: '#1aaa55',
  },
  {
    Id: 14,
    Subject: 'Aliens vs Humans',
    Location: 'Research Center of USA',
    StartTime: '2021-01-05T04:30:00.000Z',
    EndTime: '2021-01-05T06:00:00.000Z',
    CategoryColor: '#357cd2',
  },
  {
    Id: 15,
    Subject: 'Facts of Humming Birds',
    Location: 'California',
    StartTime: '2021-01-19T04:00:00.000Z',
    EndTime: '2021-01-19T05:30:00.000Z',
    CategoryColor: '#7fa900',
  },
  {
    Id: 16,
    Subject: 'Sky Gazers',
    Location: 'Alaska',
    StartTime: '2021-01-22T05:30:00.000Z',
    EndTime: '2021-01-22T07:30:00.000Z',
    CategoryColor: '#ea7a57',
  },
  {
    Id: 17,
    Subject: 'The Cycle of Seasons',
    Location: 'Research Center of USA',
    StartTime: '2021-01-11T00:00:00.000Z',
    EndTime: '2021-01-11T02:00:00.000Z',
    CategoryColor: '#00bdae',
  },
  {
    Id: 18,
    Subject: 'Space Galaxies and Planets',
    Location: 'Space Center USA',
    StartTime: '2021-01-11T11:30:00.000Z',
    EndTime: '2021-01-11T13:00:00.000Z',
    CategoryColor: '#f57f17',
  },
  {
    Id: 19,
    Subject: 'Lifecycle of Bumblebee',
    Location: 'San Fransisco',
    StartTime: '2021-01-14T00:30:00.000Z',
    EndTime: '2021-01-14T02:00:00.000Z',
    CategoryColor: '#7fa900',
  },
  {
    Id: 20,
    Subject: 'Alien Civilization',
    Location: 'Space Center USA',
    StartTime: '2021-01-14T10:30:00.000Z',
    EndTime: '2021-01-14T12:30:00.000Z',
    CategoryColor: '#ea7a57',
  },
  {
    Id: 21,
    Subject: 'Alien Civilization',
    Location: 'Space Center USA',
    StartTime: '2021-01-10T08:30:00.000Z',
    EndTime: '2021-01-10T10:30:00.000Z',
    CategoryColor: '#ea7a57',
  },
  {
    Id: 22,
    Subject: 'The Cycle of Seasons',
    Location: 'Research Center of USA',
    StartTime: '2021-01-12T09:00:00.000Z',
    EndTime: '2021-01-12T10:30:00.000Z',
    CategoryColor: '#00bdae',
  },
  {
    Id: 23,
    Subject: 'Sky Gazers',
    Location: 'Greenland',
    StartTime: '2021-01-15T09:00:00.000Z',
    EndTime: '2021-01-15T10:30:00.000Z',
    CategoryColor: '#ea7a57',
  },
  {
    Id: 24,
    Subject: 'Facts of Humming Birds',
    Location: 'California',
    StartTime: '2021-01-16T07:00:00.000Z',
    EndTime: '2021-01-16T09:00:00.000Z',
    CategoryColor: '#7fa900',
  },
];

export const dropdownData = [
  {
    Id: '1',
    Time: 'March 2023',
  },
  {
    Id: '2',
    Time: 'April 2023',
  }, {
    Id: '3',
    Time: 'May 2023',
  },
];

export const productCategory = [
  {
    categoryId: 1,
    category: 'Drilling Tools Rental',
  },
  {
    categoryId: 2,
    category: 'Fishing & Re-Entry',
  },
];

export const productList = [
  {
    productId: 1,
    categoryId: 1,
    name: 'Drill Bits',
    description: 'Drill Bits',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 2,
    categoryId: 1,
    name: 'Bit Breaker',
    description: 'Bit Breaker',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 3,
    categoryId: 1,
    name: 'Gauge Bit',
    description: 'Gauge Bit',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 4,
    categoryId: 1,
    name: 'Mill Tooth Bit',
    description: 'Mill Tooth Bit',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 5,
    categoryId: 1,
    name: 'PDC Bit',
    description: 'PDC Bit',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 6,
    categoryId: 1,
    name: 'Rock Bit',
    description: 'Rock Bit',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 7,
    categoryId: 1,
    name: 'Hole Openers',
    description: 'Hole Openers',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 8,
    categoryId: 1,
    name: 'Roller Reamers',
    description: 'Roller Reamers',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 9,
    categoryId: 1,
    name: 'Stabilizers',
    description: 'Stabilizers',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 10,
    categoryId: 1,
    name: 'Jar Boosters',
    description: 'Jar Boosters',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 11,
    categoryId: 1,
    name: 'Drilling Jars',
    description: 'Drilling Jars',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 12,
    categoryId: 2,
    name: 'Casing Cutters',
    description: 'Casing Cutters',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 13,
    categoryId: 2,
    name: 'Bumpers',
    description: 'Bumpers',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 14,
    categoryId: 2,
    name: 'Fishing Jars',
    description: 'Fishing Jars',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 15,
    categoryId: 2,
    name: 'Fishing Magnets',
    description: 'Fishing Magnets',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 16,
    categoryId: 2,
    name: 'Junk Retrievers',
    description: 'Junk Retrievers',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 17,
    categoryId: 2,
    name: 'Impression Blocks',
    description: 'Impression Blocks',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 18,
    categoryId: 2,
    name: 'Mills',
    description: 'Mills',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 19,
    categoryId: 2,
    name: 'Overshots',
    description: 'Overshots',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 20,
    categoryId: 2,
    name: 'Spears',
    description: 'Spears',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 21,
    categoryId: 2,
    name: 'Wash Pipe',
    description: 'Wash Pipe',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
  },
  {
    productId: 22,
    categoryId: 2,
    name: 'Identifiers',
    description: 'Identifiers',
    status: 'ACTIVE',
    statusDate: '2023-01-01T00:00:00.000Z',
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

export const contextMenuItems = [
  'AutoFit',
  'AutoFitAll',
  'SortAscending',
  'SortDescending',
  'Copy',
  'Edit',
  'Delete',
  'Save',
  'Cancel',
  'PdfExport',
  'ExcelExport',
  'CsvExport',
  'FirstPage',
  'PrevPage',
  'LastPage',
  'NextPage',
];
