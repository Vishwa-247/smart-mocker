import { UserButton } from "@clerk/nextjs";
import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";

function dashboard() {
  return (
    <div className=" font-poppins p-10">
      <h2 className="font-bold text-2xl text-primary"> Dashboard </h2>
      <h2 className="text-gray-500">
        {"      Create and Start your AI Mockup Interview   "}
      </h2>

      <div className="grid grid-cols-1 mid:grid-cols-3 my-7">
        <AddNewInterview />
      </div>
      {/* Previous Interview List */}
      <InterviewList />
    </div>
  );
}

export default dashboard;
