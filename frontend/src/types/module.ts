export interface Template {
  id: string;
  name: string;
  description: string;
  previewPath?: string;
}

export interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  description: string;
}

export interface ModuleFormData {
  moduleName: string;
  difficulty: "easy" | "medium" | "hard";
  numQuestions: number;
  mediaItems: MediaItem[];
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
  category: "content" | "template" | "attachment";
}

export interface ModuleGenerationRequest {
  moduleName: string;
  difficulty: string;
  numQuestions: number;
  mediaItems: MediaItem[];
  attachmentFile: File;
  templateFile?: File;
  selectedTemplate?: string;
}

export interface ModuleGenerationResponse {
  ok: boolean;
  filename?: string;
  downloadUrl?: string;
  error?: string;
}

export interface GeneratedModule {
  id: string;
  filename: string;
  downloadUrl: string;
  createdAt: string;
  projectTitle: string;
}

// API Response types
export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

// Step management
export type WorkflowStep = 1 | 2 | 3;

export interface WorkflowState {
  currentStep: WorkflowStep;
  projectTitle: string;
  selectedTemplate: string;
  moduleFormData: ModuleFormData;
  uploadedFiles: UploadedFile[];
  generatedModule: GeneratedModule | null;
  isGenerating: boolean;
}
