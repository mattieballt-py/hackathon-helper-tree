
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileUp } from "lucide-react";

export function ProfileSummary() {
  return (
    <Card>
      <CardHeader className="bg-gradient-primary py-6">
        <div className="flex items-center">
          <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center text-2xl font-bold shadow">
            GU
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-primary-foreground">Guest User</h3>
            <p className="text-sm text-primary-foreground/80">Complete your profile to get personalized help</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
            <FileUp className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Upload your CV</h3>
            <p className="mt-1 text-xs text-gray-500">Drag and drop your CV or resume here</p>
            <div className="mt-4">
              <Button 
                variant="outline"
                className="text-xs border-babyblue text-gray-700 hover:bg-babyblue/10 hover:text-gray-900"
              >
                Select File
              </Button>
            </div>
            <p className="mt-2 text-xs text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Skills Identified</h3>
            <p className="text-xs text-gray-500 mb-2">Upload your CV to analyze your skills</p>
            <div className="flex flex-wrap gap-1">
              {["React", "UI/UX", "JavaScript"].map((skill) => (
                <span 
                  key={skill}
                  className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-700"
                >
                  {skill}
                </span>
              ))}
              <span className="px-2 py-1 rounded-full bg-gray-50 text-xs text-gray-400">
                + more after CV upload
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
