"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAi";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/Schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!jobPosition || !jobDesc || !jobExperience) {
        console.error("All fields are required.");
        setLoading(false);
        return;
      }

      const inputPrompt = `
        Given the job position of: ${jobPosition},
        the job description of: ${jobDesc},
        and years of experience: ${jobExperience},
        generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT}
        interview questions and answers.
        The output should be in JSON format with each question and answer
        structured in question and answer fields.
      `;

      const result = await chatSession.sendMessage(inputPrompt);

      if (!result || !result.response) {
        console.error("No response from chat session.");
        setLoading(false);
        return;
      }

      const rawResponse = await result.response.text();

      if (!rawResponse) {
        console.error("Empty response received.");
        setLoading(false);
        return;
      }

      const cleanedResponse = rawResponse
        .replace(/```json/g, "")
        .replace(/```/g, "");

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanedResponse);
      } catch (error) {
        console.error("Failed to parse JSON response:", error);
        console.error("Raw Response:", cleanedResponse);
        setLoading(false);
        return;
      }

      if (parsedResponse) {
        const resp = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: parsedResponse,
            jobPosition,
            jobDesc,
            jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("YYYY-MM-DD"),
          })
          .returning({ mockId: MockInterview.mockId });

        if (resp && resp.length > 0) {
          console.log("Inserted ID:", resp);
          setOpenDialog(false);
          router.push(`/dashboard/interview/${resp[0]?.mockId}`);
        } else {
          console.error("Failed to insert data into the database.");
        }
      } else {
        console.error("Invalid AI response.");
      }
    } catch (error) {
      console.error("Error during AI response handling:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-poppins">
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New Interview</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell Us More about Your Interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add details about your job position/role, job description,
                    and years of experience.
                  </h2>

                  <div className="mt-7 my-3.5">
                    <label> Job Position / Job Role </label>
                    <Input
                      placeholder="Full Stack Developer"
                      required
                      value={jobPosition}
                      onChange={(e) => setJobPosition(e.target.value)}
                    />
                  </div>

                  <div className="my-3.5">
                    <label> Job Description / Tech Stack </label>
                    <Textarea
                      placeholder="MERN"
                      required
                      value={jobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                    />
                  </div>

                  <div className="my-3.5">
                    <label> Years of Experience </label>
                    <Input
                      placeholder="3 years"
                      type="number"
                      max="50"
                      required
                      value={jobExperience}
                      onChange={(e) => setJobExperience(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <LoaderCircle className="animate-spin" />
                        Generating from AI
                      </div>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
