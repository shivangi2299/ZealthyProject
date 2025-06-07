"use client";

const StepMoreInfo = ({ formData, updateFormData, goToPreviousStep, config }) => {
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
                onChange={(e) => updateFormData("firstName", e.target.value)}
              />
              <input
                type="text"
                className="w-full border rounded p-2"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => updateFormData("lastName", e.target.value)}
              />
            </div>
            <input
              type="tel"
              className="w-full border rounded p-2 mt-4"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => updateFormData("phone", e.target.value)}
            />
          </>
        );
      case "birthdate":
        return (
          <input
            type="date"
            className="w-full border rounded p-2"
            value={formData.birthdate}
            onChange={(e) => updateFormData("birthdate", e.target.value)}
          />
        );
      case "address":
        return (
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => updateFormData("address", e.target.value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {config.step3.map((fieldKey, index) => (
        <div key={index}>{renderComponent(fieldKey)}</div>
      ))}
      <div className="flex justify-between pt-4">
        <button onClick={goToPreviousStep} className="text-blue-600 font-medium">
          Back
        </button>
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default StepMoreInfo;
