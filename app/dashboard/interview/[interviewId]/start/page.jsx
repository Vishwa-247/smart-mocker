"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/Schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    GetInterviewDetails(params.interviewId);
  }, [params.interviewId]);

  const GetInterviewDetails = async (interviewId) => {
    try {
      console.log("Fetching details for interviewId:", interviewId);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      console.log("Query response:", result);

      if (!result || result.length === 0) {
        console.error("No data found for the given interviewId:", interviewId);
        return;
      }

      const jsonMockResp = JSON.parse(result[0].jsonMockResp);

      // Flatten nested arrays into a single array of questions
      const flatQuestions = Array.isArray(jsonMockResp)
        ? jsonMockResp.flatMap((item) => (Array.isArray(item) ? item : [item]))
        : Object.values(jsonMockResp).flat();

      setMockInterviewQuestions(flatQuestions);
      setInterviewData(result[0]);
      console.log("Processed flat questions array:", flatQuestions);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Pass flattened questions to QuestionsSection */}
        <QuestionsSection
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* Video and audio placeholder */}
        <RecordAnswerSection
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>
      <div className="flex justify-end gap-6 pb-7">
        {activeQuestionIndex > 0 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
          >
            Previous Question
          </Button>
        )}
        {activeQuestionIndex != mockInterviewQuestions?.length - 1 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
          >
            Next Question
          </Button>
        )}
        {activeQuestionIndex == mockInterviewQuestions?.length - 1 && (
          <Link
            href={"/dashboard/interview/" + interviewData?.mockId + "/feedback"}
          >
            <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
