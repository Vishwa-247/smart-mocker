"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/sign-in?redirect_url=/dashboard");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Welcome to Smart Mocker
          </h1>

          <p className="text-xl text-gray-600">
            Practice interviews with AI-driven insights and get better at what
            you do
          </p>
        </div>

        <Button
          onClick={handleSignIn}
          size="lg"
          className="px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Get Started
        </Button>

        <p className="text-sm text-gray-500">
          Sign in or create an account to begin your journey
        </p>
      </div>
    </main>
  );
}
