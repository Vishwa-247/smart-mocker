"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast, Toaster } from "sonner";
import { chatSession } from "@/utils/GeminiAi";
import moment from "moment";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { userAnswer as userAnswerTable } from "@/utils/Schema";

function RecordAnswerSection({
  mockInterviewQuestions,
  activeQuestionIndex,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({ continuous: true, useLegacyResults: false });

  // Update userAnswer when results change
  useEffect(() => {
    if (results.length > 0) {
      const combinedTranscript = results
        .map((result) => result.transcript)
        .join(" ");
      setUserAnswer(combinedTranscript);
      console.log("Updated user answer:", combinedTranscript);
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 1) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      console.log(userAnswer);
    } else {
      startSpeechToText();
      console.log("Recording started...");
    }
  };

  const UpdateUserAnswer = async () => {
    console.log(userAnswer);
    setIsLoading(true);
    const feedBackPrompt = `Question: ${mockInterviewQuestions[activeQuestionIndex]?.question},
        User Answer: ${userAnswer}. Based on the question and answer, provide a rating and feedback
        (3-5 lines) to improve it in JSON format with 'rating' and 'feedback' fields.`;

    const result = await chatSession.sendMessage(feedBackPrompt);
    const responseText = await result.response.text();
    const cleanedResponseText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log(cleanedResponseText);
    const feedbackResponse = JSON.parse(cleanedResponseText);

    const resp = await db.insert(userAnswerTable).values({
      mockIdRef: interviewData?.mockId,
      question: mockInterviewQuestions[activeQuestionIndex]?.question,
      correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer,
      userAns: userAnswer,
      feedback: feedbackResponse?.feedback,
      rating: String(feedbackResponse?.rating),
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("YYYY-MM-DD"),
    });

    if (!resp) {
      console.log("Insert response:", resp);
      toast("Your answer has been recorded successfully!");
      setResults([]);
    }

    setResults([]);
    setIsLoading(false);
  };

  // Return the JSX structure here
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Image
          src="/WebCam.svg"
          width={200}
          height={200}
          className="absolute"
        />
        <Webcam
          mirrored={false}
          style={{ height: 300, width: "100%", zIndex: 10 }}
        />
      </div>

      <Button
        className="my-10"
        variant="outline"
        onClick={StartStopRecording}
        disabled={isLoading}
      >
        {isRecording ? (
          <h2 className="text-red-600 flex gap-2 animate-pulse items-center">
            <StopCircle />
            Stop Recording
          </h2>
        ) : (
          <h2 className="text-primary flex gap-2 items-center">
            <Mic /> Record Answer
          </h2>
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
