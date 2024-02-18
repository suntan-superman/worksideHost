import React from 'react';
import Workside from '../assets/Workside.jpg';

const ModalDialog = ({ textMsg, open, onOK, onClose }) => {
  if (!open) return null;

  // const message = textMsg;
  // alert(message);

  return (
    // <div onClick={onClose} className="overlay">
    <div onClick={onClose} fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modalContainer"
      >
        <img src={Workside} alt="/" className="img" />
        <div className="modalRight">
          {/* <div className="content"> */}
          <div className="text-red font-bold text-xl text-center mb-20">
            {/* <p>Important:</p> */}
            <p>{textMsg}</p>
          </div>
          {/* <div className="btnContainer"> */}
          {/* <div className="container mx-auto px-4 flex flex-row h-32 w-32 "> */}
          <div className="container mx-auto px-4 flex flex-row h-32 w-32">
            <button className="inset-x-0 bottom-0 text-white bg-green-500 hover: bg-green-800 focus:outline-none font-medium text-sm rounded-lg px-5 py-2.5 text-center mr-5 h-14" type="button" onClick={onOK}>
              <span className="bold">YES</span>
            </button>
            <button className="inset-x-0 bottom-0 text-white bg-red-500 hover: bg-red-800 focus:outline-none font-medium text-sm rounded-lg px-5 py-2.5 text-center mr-5 h-14" type="button" onClick={onClose}>
              <span className="bold">NO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDialog;
// return (
//   <div onClick={onClose} className="overlay">
//     <div
//       onClick={(e) => {
//         e.stopPropagation();
//       }}
//       className="modalContainer"
//     >
//       <img src={Workside} alt="/" className="img" />
//       <div className="modalRight">
//         <div className="content">
//           {/* <p>Important:</p> */}
//           <h1>{message}</h1>
//         </div>
//         <div className="btnContainer">
//           <button className="btnPrimary" type="button" onClick={onOK}>
//             <span className="bold">YES</span>
//           </button>
//           <button className="btnOutline" type="button" onClick={onClose}>
//             <span className="bold">NO</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );
// };
