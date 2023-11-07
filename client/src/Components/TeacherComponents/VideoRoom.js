import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { appId, serversecret } from "../CourseComponent/helper";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Paper,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import { format, isBefore, isAfter, isToday } from "date-fns";

const VideoRoom = () => {
  const { teacherId, appointmentId } = useParams();
  const { search } = useLocation();
  const isTeacher = search.includes("teacher");
  const roomID = "Yourdemo";

  useEffect(() => {
    const myMeeting = async (element) => {
      try {
        // generate Kit Token
        const appID = appId;
        const serverSecret = serversecret;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          Date.now().toString(),
          "teacher"
        );

        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // start the call
        await zp.joinRoom({
          container: element,
          sharedLinks: [
            {
              name: "Personal link",
              url:
                window.location.protocol +
                "//" +
                window.location.host +
                window.location.pathname +
                "?roomID=" +
                roomID,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
        });
      } catch (error) {
        console.error("Error joining room:", error);
      }
    };

    myMeeting(document.getElementById("elementId"));
  }, [teacherId, roomID]);

  return <div id="elementId" style={{ width: "100vw", height: "100vh" }}></div>;
};

export default VideoRoom;
