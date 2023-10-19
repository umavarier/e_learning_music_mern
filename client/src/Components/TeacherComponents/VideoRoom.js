import React from 'react'
import {useParams} from 'react-router-dom';
import {appId, serversecret} from '../CourseComponent/helper' 
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

// const VideoRoom = () => {

//     // const {roomid} = useParams();
//     const roomid = "yourfreedemo"
//     const {teacherId, appointmentId} = useParams()
//     // console.log(roomId)
//     const myMeeting = async(element) => {
//         const appID = appId
//         const serverSecret = serversecret
//         const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomid, teacherId,"teacher"  );//userid for Date.now().toString()

//         //Create instance object from kit token
//         const zp = ZegoUIKitPrebuilt.create(kitToken);

//         zp.joinRoom({
//             container: element,
//             sharedLinks: [  
//               {
//                 name:'Personal link',
//                 url:
//                   window.location.protocol + '//' +
//                   window.location.host + window.location.pathname +
//                   '?roomid =' +
//                   roomid, 

//               },
//             ],
//             scenario : {
//                 mode:ZegoUIKitPrebuilt.OneONoneCall
//             }
//         })

//     }

//   return (
//     <div>
//       <div ref={myMeeting}
//            style={{width:'100vw', height: '100vh'}} >
//       </div>
      
//     </div>
//   )
// }

// export default VideoRoom

export default function videoRoom() {
  const roomID = "Yourdemo"
  
  let myMeeting = async (element) => {
 // generate Kit Token
  const appID = appId;
  const serverSecret = serversecret;
  const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID,  Date.now().toString(),  "teacher");


 // Create instance object from Kit Token.
  const zp = ZegoUIKitPrebuilt.create(kitToken);
  // start the call
  zp.joinRoom({
    container: element,
    sharedLinks: [
      {
        name: 'Personal link',
        url:
         window.location.protocol + '//' + 
         window.location.host + window.location.pathname +
          '?roomID=' +
          roomID,
      },
    ],
    scenario: {
      mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
    },
  });


};

return (
<div
  
  ref={myMeeting}
  style={{ width: '100vw', height: '100vh' }}
></div>
);
}
