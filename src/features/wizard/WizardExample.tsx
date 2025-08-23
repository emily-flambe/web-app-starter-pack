import { useState } from 'react';

/**
 * Example wizard component demonstrating a multi-step form pattern
 * 
 * TODO: Customize this wizard for your specific use case:
 * - Update the steps to match your flow
 * - Add your form fields and validation
 * - Connect to your API endpoints
 * - Style according to your design system
 */
export function WizardExample() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // TODO: Replace with your own form data structure
  const [formData, setFormData] = useState({
    // Add your fields here
  });

  const handleNext = () => {
    // TODO: Add validation logic before proceeding
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // TODO: Submit to your API
      console.log('Submitting form data:', formData);
      // const result = await apiClient.submitData(formData);
    } catch (error) {
      console.error('Submission error:', error);
      // TODO: Handle errors appropriately
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Wizard Example</h1>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 mx-1 rounded ${
                i < currentStep ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-lg shadow p-6 min-h-[300px]">
        {currentStep === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 1: Basic Information</h2>
            {/* TODO: Add your form fields for step 1 */}
            <p className="text-gray-600">Add your form fields here</p>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 2: Details</h2>
            {/* TODO: Add your form fields for step 2 */}
            <p className="text-gray-600">Add your form fields here</p>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 3: Preferences</h2>
            {/* TODO: Add your form fields for step 3 */}
            <p className="text-gray-600">Add your form fields here</p>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 4: Review & Confirm</h2>
            {/* TODO: Add review/summary of collected data */}
            <p className="text-gray-600">Display summary of collected information here</p>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        {currentStep < totalSteps ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}