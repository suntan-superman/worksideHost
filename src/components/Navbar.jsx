/* eslint-disable */
import React, { useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import useUserStore from '../stores/UserStore';
import { signalAccessLevel } from "../stores/SignalStores";

import avatar from '../data/avatar.jpg';
// eslint-disable-next-line import/no-cycle
import { Chat, Notification, UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const { currentColor, activeMenu, setActiveMenu, handleClick, isClicked, setScreenSize, screenSize, globalUserName, accessLevel } = useStateContext();
  const [welcomePhrase, setWelcomePhrase] = React.useState("");
  // const accessLevel = useUserStore((state) => state.accessLevel);
  const [accessLabel, setAccessLabel] = React.useState("UNKNOWN"); 

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    setWelcomePhrase(`Welcome, ${userName}`);
    const accessLevel = Number(localStorage.getItem("accessLevel"));
    switch (accessLevel) {
      case 0:
        setAccessLabel("GUEST");
        break;
      case 1:
        setAccessLabel("STANDARD");
        break;
      case 2:
        setAccessLabel("POWER");
        break;
      case 3:
        setAccessLabel("ADMIN");
        break;
      default:
        setAccessLabel("GUEST");
    }
  }, []);
    
  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 ">

      <NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={<AiOutlineMenu />} />
      <div className="flex">
        <NavButton title="Chat" dotColor="#03C9D7" customFunc={() => handleClick('chat')} color={currentColor} icon={<BsChatLeft />} />
        <NavButton title="Notification" dotColor="rgb(254, 201, 15)" customFunc={() => handleClick('notification')} color={currentColor} icon={<RiNotification3Line />} />
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick('userProfile')}
            onKeyDown={(e) => { if (e.key === 'Enter') handleClick('userProfile'); }}
          >
            {/* <img
              className="rounded-full w-8 h-8"
              src={avatar}
              alt="user-profile"
            /> */}
            <p>
              <span className="text-black font-bold text-14">{welcomePhrase}</span>
              <br/>
              <span className="text-gray-400 font-bold ml-1 text-14">
                Access Level: {accessLabel}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </TooltipComponent>
        {isClicked.chat && (<Chat />)}
        {isClicked.notification && (<Notification />)}
        {isClicked.userProfile && (<UserProfile />)}
      </div>
    </div>
  );
};

export default Navbar;
