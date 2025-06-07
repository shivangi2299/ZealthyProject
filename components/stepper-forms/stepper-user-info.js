"use client";

import { auth, db } from "@/app/firebase/config";
import { doc, updateDoc } from "firebase/firestore";

const StepUserInfo = ({ formData, updateFormData, goToNextStep, goToPreviousStep, config }) => {
  const handleLiveUpdate = async (field, value) => {
    updateFormData(field, value);
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { [field]: value });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  const renderComponent = (key) => {
    switch (key) {
      case "about":
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                className="w-full border rounded p-2"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleLiveUpdate("firstName", e.target.value)}
              />
              <input
                type="text"
                className="w-full border rounded p-2"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleLiveUpdate("lastName", e.target.value)}
              />
            </div>
            <input
              type="tel"
              className="w-full border rounded p-2 mt-4"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => handleLiveUpdate("phone", e.target.value)}
            />
          </>
        );
      case "birthdate":
        return (
          <input
            type="date"
            className="w-full border rounded p-2"
            value={formData.birthdate}
            onChange={(e) => handleLiveUpdate("birthdate", e.target.value)}
          />
        );
      case "address":
        return (
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => handleLiveUpdate("address", e.target.value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {config.step2.map((fieldKey, index) => (
        <div key={index}>{renderComponent(fieldKey)}</div>
      ))}
      <div className="flex justify-between pt-4">
        <button onClick={goToPreviousStep} className="text-blue-600 font-medium">
          Back
        </button>
        <button
          onClick={goToNextStep}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepUserInfo;
