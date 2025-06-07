"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/app/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import LoginForm from "./login-form/page";
import SignupForm from "./sign-up/page";
import { useRouter } from "next/navigation";

const StepperForm = () => {
  const [step, setStep] = useState(1);
  const [isLogin, setIsLogin] = useState(true);
  const [config, setConfig] = useState({ step2: [], step3: [] });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    birthdate: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: ""
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

   
  const saveStepToFirestore = async (stepNumber) => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { lastStep: stepNumber }, { merge: true });
    }
  };
  const updateFormData = async (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    const updatedErrors = { ...errors };
    if ((field === "firstName" || field === "lastName") && /\d/.test(value)) {
      updatedErrors[field] = `${field === "firstName" ? "First" : "Last"} name should contain only letters.`;
    } else if (field === "phone") {
      if (/[^0-9]/.test(value)) {
        updatedErrors.phone = "Phone number must contain only digits.";
      } else if (value.length !== 10) {
        updatedErrors.phone = "Phone number must be exactly 10 digits.";
      } else {
        delete updatedErrors.phone;
      }
    } else if (field === "birthdate") {
      const enteredDate = new Date(value);
      const today = new Date();
      const maxAllowedDate = new Date(today);
      maxAllowedDate.setFullYear(today.getFullYear() - 1);

      if (enteredDate > maxAllowedDate) {
        updatedErrors.birthdate = "Birthdate must be at least one year before today.";
      } else {
        delete updatedErrors.birthdate;
      }
    } else {
      delete updatedErrors[field];
    }
    setErrors(updatedErrors);

    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { [field]: value }, { merge: true });
    }
  };

  const validateStep = () => {
    const nameValid = /^[A-Za-z]+$/;
    const phoneValid = /^[0-9]{10}$/;
    const newErrors = {};

    if (config[`step${step}`]?.includes("about")) {
      if (!formData.firstName || !nameValid.test(formData.firstName)) {
        newErrors.firstName = "First name should contain only letters and not be empty.";
      }
      if (!formData.lastName || !nameValid.test(formData.lastName)) {
        newErrors.lastName = "Last name should contain only letters and not be empty.";
      }
      if (!formData.phone || !phoneValid.test(formData.phone)) {
        newErrors.phone = "Phone number must be exactly 10 digits and contain only digits.";
      }
    }

    if (config[`step${step}`]?.includes("birthdate")) {
      if (!formData.birthdate) {
        newErrors.birthdate = "Birthdate cannot be empty.";
      } else {
        const birthDate = new Date(formData.birthdate);
        const today = new Date();
        const maxAllowedDate = new Date(today);
        maxAllowedDate.setFullYear(today.getFullYear() - 1);

        if (birthDate > maxAllowedDate) {
          newErrors.birthdate = "Birthdate must be at least one year before today's date.";
        }
      }
    }

    if (config[`step${step}`]?.includes("address")) {
      if (!formData.addressLine1 || !formData.city || !formData.state || !formData.zip) {
        newErrors.address = "All address fields must be filled out.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const goToNextStep = () => {
  if (validateStep()) {
    const nextStep = Math.min(step + 1, 3);
    setStep(nextStep);
    saveStepToFirestore(nextStep); // <- Save after going forward
  }
};

const goToPreviousStep = () => {
  const prevStep = Math.max(step - 1, 1);
  setStep(prevStep);
  saveStepToFirestore(prevStep); // <- Save after going back
};

  useEffect(() => {
    const fetchConfig = async () => {
      const ref = doc(db, "formConfig", "componentAssignment");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setConfig(snap.data());
      }
    };
    fetchConfig();
  }, []);

const initializeUserDoc = async () => {
  const user = auth.currentUser;
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      createdAt: new Date().toISOString(),
      ...formData,
      lastStep: 2 // default to step 2 if new
    });
  } else {
    const data = userSnap.data();
    if (data.lastStep && typeof data.lastStep === "number") {
      setStep(data.lastStep); // Restore last visited step
    }
  }
};


  useEffect(() => {
    if (auth.currentUser) {
      initializeUserDoc();
    }
  }, []);

  const handleFinalSubmit = () => {
    const nameForURL = formData.firstName;
    alert(" Submitted Successfully!");
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      birthdate: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zip: ""
    });
    setErrors({});
    router.push(`/home?name=${encodeURIComponent(nameForURL)}`);
  };

  const today = new Date();
  const maxBirthDate = new Date(today);
  maxBirthDate.setFullYear(today.getFullYear() - 1);
  const formattedMaxDate = maxBirthDate.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="flex items-center justify-center bg-white rounded-lg border p-6 w-full max-w-3xl mb-8">
        {["Login/Signup", "User Info", "More Info"].map((label, idx) => {
          const currentStep = idx + 1;
          const isCompleted = step > currentStep;
          const isActive = step === currentStep;
          return (
            <div key={idx} className="flex items-center w-1/3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                isCompleted
                  ? "bg-blue-600 text-white"
                  : isActive
                  ? "border-2 border-blue-600 text-blue-600 font-semibold"
                  : "border text-gray-400"
              }`}>
                {isCompleted ? "✓" : `0${currentStep}`}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isActive ? "text-blue-600" : isCompleted ? "text-gray-900" : "text-gray-400"
              }`}>
                {label}
              </span>
              {idx < 2 && <div className="flex-grow h-0.5 bg-gray-200 mx-2"></div>}
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
        {step === 1 && (
          isLogin ? (
            <LoginForm onSuccess={goToNextStep} switchToSignup={() => setIsLogin(false)} />
          ) : (
            <SignupForm onSuccess={goToNextStep} switchToLogin={() => setIsLogin(true)} />
          )
        )}

        {(step === 2 || step === 3) && (
          <div className="space-y-4">
            {config[`step${step}`]?.includes("about") && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="First Name"
                      className="w-full border rounded p-2"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                    />
                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="Last Name"
                      className="w-full border rounded p-2"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                    />
                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <input
                    type="tel"
                    autoComplete="off"
                    placeholder="Phone Number"
                    className="w-full border rounded p-2"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </>
            )}
            {config[`step${step}`]?.includes("birthdate") && (
              <div>
                <input
                  type="date"
                  autoComplete="off"
                  className="w-full border rounded p-2"
                  max={formattedMaxDate}
                  value={formData.birthdate}
                  onChange={(e) => updateFormData("birthdate", e.target.value)}
                />
                {errors.birthdate && <p className="text-xs text-red-500 mt-1">{errors.birthdate}</p>}
              </div>
            )}
            {config[`step${step}`]?.includes("address") && (
              <>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Street Address"
                  className="w-full border rounded p-2"
                  value={formData.addressLine1}
                  onChange={(e) => updateFormData("addressLine1", e.target.value)}
                />
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Apartment/Suite (optional)"
                  className="w-full border rounded p-2"
                  value={formData.addressLine2}
                  onChange={(e) => updateFormData("addressLine2", e.target.value)}
                />
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="City"
                  className="w-full border rounded p-2"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                />
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="State"
                  className="w-full border rounded p-2"
                  value={formData.state}
                  onChange={(e) => updateFormData("state", e.target.value)}
                />
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="ZIP Code"
                  className="w-full border rounded p-2"
                  value={formData.zip}
                  onChange={(e) => updateFormData("zip", e.target.value)}
                />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </>
            )}
            <div className="flex justify-between pt-4">
              <button onClick={goToPreviousStep} className="text-blue-600 font-medium">Back</button>
              <button
                onClick={step === 2 ? goToNextStep : handleFinalSubmit}
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
              >
                {step === 2 ? "Next" : "Submit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepperForm;
