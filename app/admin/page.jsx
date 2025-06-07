"use client";

import { useState } from "react";
import { db } from "@/app/firebase/config";
import { doc, setDoc } from "firebase/firestore";

const components = ["birthdate", "about", "address"];

export default function AdminPage() {
  const [assignments, setAssignments] = useState({
    birthdate: "page3",
    about: "page2",
    address: "page3",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (component, page) => {
    setAssignments((prev) => ({
      ...prev,
      [component]: page,
    }));
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const step2 = Object.entries(assignments)
      .filter(([_, page]) => page === "page2")
      .map(([comp]) => comp);
    const step3 = Object.entries(assignments)
      .filter(([_, page]) => page === "page3")
      .map(([comp]) => comp);

    if (step2.length === 0 || step3.length === 0) {
      setMessage(" Each page must have at least one component.");
      return;
    }

    const config = { step2, step3 };

    try {
      await setDoc(doc(db, "formConfig", "componentAssignment"), config);
      setMessage(" Configuration saved successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Firebase save failed:", err);
      setMessage("Failed to save configuration. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-700">Admin Page Setup</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`text-sm px-4 py-2 border rounded-md transition ${
              isEditing
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {components.map((component) => (
            <div
              key={component}
              className="flex justify-between items-center border-b pb-2"
            >
              <label className="capitalize font-medium text-gray-700">
                {component}
              </label>
              <div className="flex gap-6 text-sm">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={component}
                    value="page2"
                    disabled={!isEditing}
                    checked={assignments[component] === "page2"}
                    onChange={() => handleChange(component, "page2")}
                  />
                  Page 2
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={component}
                    value="page3"
                    disabled={!isEditing}
                    checked={assignments[component] === "page3"}
                    onChange={() => handleChange(component, "page3")}
                  />
                  Page 3
                </label>
              </div>
            </div>
          ))}

          {message && (
            <p
              className={`text-center font-medium ${
                message.startsWith("✅")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {isEditing && (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Save Configuration
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
