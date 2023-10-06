import React from 'react'
import {useParams} from 'react-router-dom';
import {appId, serversecret} from '../../Components/CourseComponent/helper' 
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const VideoRoom = () => {

    const {roomid} = useParams();
    // console.log(roomId)
    const myMeeting = async(element) => {
        const appID = appId
        const serverSecret = serversecret
        const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomid, Date.now().toString(),  "teacher");//userid for Date.now().toString()

        //Create instance object from kit token
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
            container: element,
            scenario : {
                mode:ZegoUIKitPrebuilt.OneONoneCall
            }
        })

    }

  return (
    <div>
      <div ref={myMeeting}></div>
    </div>
  )
}

export default VideoRoom
