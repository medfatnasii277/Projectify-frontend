import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Upload, FileText, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-bg.jpg";

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export default function ProjectCreate() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setUploadStatus('uploading');

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      // Send to backend
      const response = await fetch('http://localhost:3000/api/projects/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (response.ok && result.project && result.project._id) {
        setUploadStatus('success');
        toast({
          title: "Project created successfully!",
          description: `"${file.name}" has been processed and your project is ready.`,
        });
        setTimeout(() => {
          navigate(`/project/${result.project._id}`);
        }, 1500);
      } else {
        setUploadStatus('error');
        toast({
          title: "Upload failed",
          description: result.message || 'There was an error processing your file.',
          variant: "destructive",
        });
      }
    } catch (error) {
      setUploadStatus('error');
      toast({
        title: "Upload failed",
        description: 'There was an error processing your file.',
        variant: "destructive",
      });
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      {/* Background Hero Image */}
      <div 
        className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold text-foreground">
            Create New Project
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload a PDF document and let our AI automatically generate a structured project 
            with tasks and subtasks for you to refine.
          </p>
        </div>

      {/* Upload Card */}
      <Card className="max-w-2xl mx-auto p-8 card-elevated">
        {uploadStatus === 'idle' && (
          <div
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300",
              dragActive 
                ? "border-primary bg-primary/5 scale-105" 
                : "border-border hover:border-primary/50 hover:bg-primary/2"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleChange}
            />
            
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Drop your PDF here
                </h3>
                <p className="text-muted-foreground">
                  or click to browse and select a file
                </p>
              </div>
              
              <Button 
                onClick={onButtonClick}
                className="btn-hero"
              >
                Choose PDF File
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Supported format: PDF (Max size: 10MB)
              </p>
            </div>
          </div>
        )}

        {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {uploadStatus === 'uploading' 
                  ? 'Uploading your document...' 
                  : 'AI is processing your document...'
                }
              </h3>
              <p className="text-muted-foreground">
                {uploadStatus === 'uploading'
                  ? 'Please wait while we upload your PDF.'
                  : 'Creating your project structure with tasks and subtasks.'
                }
              </p>
              {uploadedFile && (
                <p className="text-sm text-muted-foreground">
                  File: {uploadedFile.name}
                </p>
              )}
            </div>
            
            <div className="w-full max-w-xs mx-auto bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000 animate-pulse-gentle"
                style={{ width: uploadStatus === 'uploading' ? '30%' : '80%' }}
              />
            </div>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-secondary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                Project Created Successfully!
              </h3>
              <p className="text-muted-foreground">
                Your project is ready. Redirecting you to the project view...
              </p>
              {uploadedFile && (
                <p className="text-sm text-muted-foreground">
                  File: {uploadedFile.name}
                </p>
              )}
            </div>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-destructive">
                Upload Failed
              </h3>
              <p className="text-muted-foreground">
                There was an error processing your file. Please try again.
              </p>
            </div>
            
            <Button onClick={resetUpload} variant="outline">
              Try Again
            </Button>
          </div>
        )}
      </Card>

        {/* Features Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 text-center card-interactive">
            <FileText className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">
              AI-Powered Analysis
            </h3>
            <p className="text-sm text-muted-foreground">
              Our AI reads your PDF and extracts key information to create structured projects.
            </p>
          </Card>
          
          <Card className="p-6 text-center card-interactive">
            <CheckCircle className="w-8 h-8 text-secondary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">
              Smart Task Generation
            </h3>
            <p className="text-sm text-muted-foreground">
              Automatically generates tasks and subtasks based on document content.
            </p>
          </Card>
          
          <Card className="p-6 text-center card-interactive">
            <Upload className="w-8 h-8 text-accent mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">
              Easy Refinement
            </h3>
            <p className="text-sm text-muted-foreground">
              Edit, reorganize, and customize your project structure after creation.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}