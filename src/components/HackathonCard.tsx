
import { cn } from "@/lib/utils";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HackathonCardProps {
  title: string;
  description: string;
  date: string;
  location: string;
  duration: string;
  className?: string;
}

export function HackathonCard({
  title,
  description,
  date,
  location,
  duration,
  className,
}: HackathonCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="h-2 bg-gradient-primary" />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 opacity-70" /> 
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 opacity-70" /> 
            <span>{duration}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 opacity-70" /> 
            <span>{location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-gradient-primary">View Details</Button>
      </CardFooter>
    </Card>
  );
}
