"use client";

import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { MockInterview } from "@/utils/Schema";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebcamEnabled] = useState(false);

  useEffect(() => {
    if (params?.interviewId) {
      GetInterviewDetails(params.interviewId);
    } else {
      console.error("Interview ID not provided.");
    }
  }, [params]);

  const GetInterviewDetails = async (interviewId) => {
    try {
      // Fetch data from the database
      const response = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      // Assuming response returns an array and you want the first item
      setInterviewData(response[0]); // Corrected from 'result[0]'
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div className="my-10 ">
      <h2 className="font-bold text-2xl">Let's get started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className=" flex flex-col w-full my-5 gap-5 ">
          {interviewData ? (
            <div className=" flex flex-col  my-3 gap-5 p-5 rounded-lg border">
              {/* <h3 className="font-semibold">Interview Details:</h3> */}
              <h2 className="text-lg">
                <strong>Job Role / Job Position :</strong>{" "}
                {interviewData.jobPosition}
              </h2>
              <h2 className="text-lg">
                <strong>Job Description / Tech Stack:</strong>{" "}
                {interviewData.jobDesc}
              </h2>
              <h2 className="text-lg">
                <strong>Years Of Experience:</strong>{" "}
                {interviewData.jobExperience} years
              </h2>
            </div>
          ) : (
            <p>Loading interview details...</p> // This part was added
          )}

          <div className="p-4 rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <Lightbulb /> <strong>Information</strong>
            </h2>
            <h2 className="mt-3 text-yellow-500">
              {process.env.NEXT_PUBLIC_INFORMATION}
            </h2>
          </div>
        </div>

        <div>
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebcamEnabled(true)}
              onUserMediaError={() => setWebcamEnabled(false)}
              mirrored={true}
              style={{ height: 300, width: 300 }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button
                variant="ghost"
                className="w-full "
                onClick={() => setWebcamEnabled(true)}
              >
                {" "}
                Enable Webcam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end items-end">
        <Link href={"/dashboard/interview/" + params.interviewId + "/start"}>
          <Button> Start Interview </Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
