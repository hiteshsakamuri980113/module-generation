import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  WorkflowState,
  WorkflowStep,
  Template,
  UploadedFile,
  ModuleFormData,
  GeneratedModule,
} from "../types/module";
import { apiService } from "../services/apiService";

interface ModuleContextType extends WorkflowState {
  // Navigation
  setCurrentStep: (step: WorkflowStep) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Project setup
  setProjectTitle: (title: string) => void;
  setSelectedTemplate: (templateId: string) => void;

  // Module configuration
  setModuleFormData: (data: Partial<ModuleFormData>) => void;

  // File management
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (fileId: string) => void;
  clearUploadedFiles: () => void;

  // Module generation
  generateModule: (overrideData?: Partial<ModuleFormData>) => Promise<void>;
  downloadModule: () => void;

  // Reset
  resetWorkflow: () => void;

  // Error handling
  error: string | null;
  clearError: () => void;
}

const defaultModuleFormData: ModuleFormData = {
  moduleName: "",
  difficulty: "medium",
  numQuestions: 10,
  mediaItems: [],
};

const defaultState: WorkflowState = {
  currentStep: 1,
  projectTitle: "",
  selectedTemplate: "",
  moduleFormData: defaultModuleFormData,
  uploadedFiles: [],
  generatedModule: null,
  isGenerating: false,
};

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<WorkflowState>(defaultState);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const setCurrentStep = useCallback((step: WorkflowStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(3, prev.currentStep + 1) as WorkflowStep,
    }));
  }, []);

  const previousStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1) as WorkflowStep,
    }));
  }, []);

  const setProjectTitle = useCallback((title: string) => {
    setState((prev) => ({
      ...prev,
      projectTitle: title,
      moduleFormData: { ...prev.moduleFormData, moduleName: title },
    }));
  }, []);

  const setSelectedTemplate = useCallback((templateId: string) => {
    setState((prev) => ({ ...prev, selectedTemplate: templateId }));
  }, []);

  const setModuleFormData = useCallback((data: Partial<ModuleFormData>) => {
    setState((prev) => ({
      ...prev,
      moduleFormData: { ...prev.moduleFormData, ...data },
    }));
  }, []);

  const addUploadedFile = useCallback((file: UploadedFile) => {
    setState((prev) => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, file],
    }));
  }, []);

  const removeUploadedFile = useCallback((fileId: string) => {
    setState((prev) => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((f) => f.id !== fileId),
    }));
  }, []);

  const clearUploadedFiles = useCallback(() => {
    setState((prev) => ({ ...prev, uploadedFiles: [] }));
  }, []);

  const generateModule = useCallback(
    async (overrideData?: Partial<ModuleFormData>) => {
      try {
        setError(null);
        setState((prev) => ({ ...prev, isGenerating: true }));

        // Use override data if provided, otherwise use current state
        const finalModuleData = overrideData
          ? { ...state.moduleFormData, ...overrideData }
          : state.moduleFormData;

        console.log("Using module data:", finalModuleData);

        // Validate required data
        const attachmentFile = state.uploadedFiles.find(
          (f) => f.category === "content" || f.category === "attachment"
        )?.file;
        if (!attachmentFile) {
          throw new Error("Please upload a content document");
        }

        if (!state.projectTitle.trim()) {
          throw new Error("Please provide a module name");
        }

        if (!state.selectedTemplate) {
          throw new Error("Please select a template");
        }

        // Get template file if custom template is selected
        const templateFile =
          state.selectedTemplate === "custom"
            ? state.uploadedFiles.find((f) => f.category === "template")?.file
            : undefined;

        // Prepare request data
        const requestData = {
          moduleName: state.projectTitle, // Use project title as module name
          difficulty: finalModuleData.difficulty,
          numQuestions: finalModuleData.numQuestions,
          mediaItems: finalModuleData.mediaItems,
          attachmentFile,
          templateFile,
          selectedTemplate: state.selectedTemplate,
        };

        // Call API
        const response = await apiService.generateModule(requestData);

        console.log("API Response:", response);

        if (response.ok && response.filename && response.downloadUrl) {
          const generatedModule: GeneratedModule = {
            id: Date.now().toString(),
            filename: response.filename,
            downloadUrl: response.downloadUrl,
            createdAt: new Date().toISOString(),
            projectTitle: state.projectTitle,
          };

          console.log("Generated module:", generatedModule);

          setState((prev) => ({
            ...prev,
            generatedModule,
            isGenerating: false,
            currentStep: 3,
          }));
        } else {
          throw new Error(response.error || "Failed to generate module");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        setState((prev) => ({ ...prev, isGenerating: false }));
      }
    },
    [state]
  );

  const downloadModule = useCallback(() => {
    if (state.generatedModule) {
      // Construct full URL with backend base URL
      const fullDownloadUrl = `http://localhost:5174${state.generatedModule.downloadUrl}`;

      // Create a temporary link to trigger download
      const link = document.createElement("a");
      link.href = fullDownloadUrl;
      link.download = state.generatedModule.filename;
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [state.generatedModule]);

  const resetWorkflow = useCallback(() => {
    setState(defaultState);
    setError(null);
  }, []);

  const value: ModuleContextType = {
    ...state,
    setCurrentStep,
    nextStep,
    previousStep,
    setProjectTitle,
    setSelectedTemplate,
    setModuleFormData,
    addUploadedFile,
    removeUploadedFile,
    clearUploadedFiles,
    generateModule,
    downloadModule,
    resetWorkflow,
    error,
    clearError,
  };

  return (
    <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>
  );
};

export const useModule = (): ModuleContextType => {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error("useModule must be used within a ModuleProvider");
  }
  return context;
};
