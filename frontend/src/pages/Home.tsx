import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useModule } from "../contexts/ModuleContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SelectTemplate from "../components/SelectTemplate";
import UploadDocuments from "../components/UploadDocuments";
import DownloadModule from "../components/DownloadModule";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    currentStep,
    projectTitle,
    selectedTemplate,
    uploadedFiles,
    generatedModule,
    isGenerating,
    error,
    nextStep,
    previousStep,
    setProjectTitle,
    setSelectedTemplate,
    setCurrentStep,
    downloadModule,
    clearError,
  } = useModule();

  const [progress, setProgress] = useState(0);

  // Simulate progress while isGenerating is true (indeterminate-ish)
  useEffect(() => {
    let timer: number | undefined;
    if (isGenerating) {
      setProgress(5);
      timer = window.setInterval(() => {
        setProgress((p) => Math.min(95, p + Math.random() * 8));
      }, 2000);
    } else {
      setProgress(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGenerating]);

  // Prevent accidental refresh/navigation while generating
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isGenerating) {
        e.preventDefault();
        e.returnValue = "Generation in progress — leaving will cancel the job.";
        return e.returnValue;
      }
      return undefined;
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isGenerating]);

  return (
    <div className="min-h-screen">
      <div className="flex justify-center pt-4">
        <Navbar variant="home" />
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div
        className={`h-[calc(100vh-5rem)] flex px-4 ${
          currentStep === 3
            ? "items-start justify-center pt-20"
            : "items-center justify-center"
        }`}
      >
        <div className="flex flex-col items-center space-y-8">
          {/* Header Section - Only for steps 1 and 2 */}
          {currentStep !== 3 && (
            <div className="text-center space-y-4">
              <h1 className="font-inter font-semibold text-[30px] leading-[36px] tracking-[-0.75%] text-center text-black">
                Create a New Module
              </h1>
              <p className="font-inter font-normal text-[14px] leading-[24px] tracking-[0%] text-center text-accent">
                Hello, {user?.name}! Manage your projects and settings
              </p>
            </div>
          )}

          {/* Progress Overlay */}
          {isGenerating && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
              <div className="bg-white p-6 md:p-8 rounded-lg text-center w-[90%] max-w-lg mx-4">
                <h2 className="font-inter font-semibold text-lg text-black mb-3">
                  Generating your module
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  This can take few minutes depending on document size. Please
                  do not refresh the page.
                </p>

                <div className="w-full bg-gray-200 rounded overflow-hidden h-3 mb-3">
                  <div
                    className="bg-indigo-600 h-3 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Working…</span>
                  <span>{Math.round(progress)}%</span>
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  The process runs in the background — you will be taken to the
                  download page automatically when finished.
                </p>
              </div>
            </div>
          )}

          {/* Main Card Section - Only for steps 1 and 2 */}
          {currentStep !== 3 ? (
            <div className="w-[816px] h-[528px] gap-6 opacity-100 p-6 rounded-md border border-border bg-white">
              <div className="h-full overflow-auto">
                {currentStep === 1 ? (
                  <SelectTemplate
                    onTemplateSelect={setSelectedTemplate}
                    onSaveAndContinue={nextStep}
                    onProjectTitleChange={setProjectTitle}
                    selectedTemplate={selectedTemplate}
                    projectTitle={projectTitle}
                    // pass isGenerating so the component may disable actions if needed
                    // (it currently ignores it, but future-proofing)
                    isGenerating={isGenerating}
                  />
                ) : (
                  <UploadDocuments
                    onGoBackToStep1={previousStep}
                    uploadedFiles={uploadedFiles}
                    isGenerating={isGenerating}
                  />
                )}
              </div>
            </div>
          ) : (
            <DownloadModule
              onDownload={downloadModule}
              onGoBack={() => setCurrentStep(1)}
              isReady={!!generatedModule}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
