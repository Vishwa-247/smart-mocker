"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/Schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { desc } from "drizzle-orm";
import InterviewItemCard from "./InterviewItemCard";

function InterviewList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    console.log("Current user:", user);
    if (user) {
      GetInterviewList();
    }
  }, [user]);
  const GetInterviewList = async () => {
    // First, let's debug what we're actually querying with
    console.log(
      "User email being queried:",
      user?.primaryEmailAddress?.emailAddress
    );

    const result = await db
      .select()
      .from(MockInterview)
      .where(
        eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
      )
      .orderBy(desc(MockInterview.id));

    console.log(result);
    setInterviewList(result);
  };

  return (
    <div>
      <h2 className="font-medium text-xl">Previous Mock Interview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-5 ">
        {interviewList &&
          interviewList.map((interview, index) => (
            <InterviewItemCard interview={interview} key={index} />
          ))}
      </div>
    </div>
  );
}

export default InterviewList;
