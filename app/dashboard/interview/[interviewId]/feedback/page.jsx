"use client";

import { db } from "@/utils/db";
import { userAnswer } from "@/utils/Schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter();
  useEffect(() => {
    GetFeedback();
  }, []);
  const GetFeedback = async () => {
    const result = await db
      .select()
      .from(userAnswer)
      .where(eq(userAnswer.mockIdRef, params.interviewId))
      .orderBy(userAnswer.id);

    console.log(result);
    setFeedbackList(result);
  };
  return (
    <div className=" font-poppins p-10">
      {feedbackList?.length == 0 ? (
        <h2 className=" font-semibold text-2xl text-gray-500 my-3">
          No Interview Feedback Record Found
        </h2>
      ) : (
        <>
          <h2 className="text-3xl font bold text-green-500">
            Congratulations!
          </h2>
          <h2 className="font-bold text-2xl">
            {" "}
            Here is your interview FeedBack
          </h2>
          <h2 className="text-primary text-lg my-3">
            Your Overall Interview rating : <strong>7/10</strong>
          </h2>

          <h2 className="text-sm text-gray-500">
            {" "}
            Find Below Interview With Correct Answer , Your Answer and feedback
            for improvement{" "}
          </h2>

          {feedbackList &&
            feedbackList.map((item, index) => (
              <Collapsible key={index} className="mt-8">
                <CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 gap-7 text-left flex justify-between w-full">
                  {item.question}
                  <ChevronsUpDown className="h-4 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-red-500 p-2 border rounded-lg">
                      <strong>Rating : </strong>
                      {item.rating}/10
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                      <strong>Your Answer : </strong>
                      {item.userAns}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                      <strong>Correct Answer : </strong>
                      {item.correctAns}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary">
                      <strong> Feedback : </strong>
                      {item.feedback}
                    </h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
        </>
      )}

      <Button className="mt-3" onClick={() => router.replace("/dashboard")}>
        Go Home
      </Button>
    </div>
  );
}

export default feedback;
