"use client";

import { useState } from "react";

export default function Home() {
  const [apiResponse, setApiResponse] = useState<string>("");

  const handleApiTest = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`);
    const data = await response.json();
    console.log(data);
    setApiResponse(data.message);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">AI Prompt Manager</h1>
      <p className="text-lg text-gray-500">
        This is a simple AI prompt manager built with Next.js and Tailwind CSS.
      </p>
      <button
        onClick={handleApiTest}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        API Test
      </button>
      <p className="text-lg text-gray-500">{apiResponse}</p>
    </div>
  );
}
