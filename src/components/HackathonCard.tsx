
import { cn } from "@/lib/utils";
import { Calendar, Clock, MapPin, Globe, Wifi, Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HackathonCardProps {
  title: string;
  description: string;
  date: string;
  location: string;
  duration: string;
  className?: string;
  locationType?: 'in-person' | 'remote' | 'hybrid';
  onClick?: () => void;
}

export function HackathonCard({
  title,
  description,
  date,
  location,
  duration,
  locationType = 'hybrid',
  className,
  onClick,
}: HackathonCardProps) {
  
  const getLocationIcon = () => {
    switch (locationType) {
      case 'in-person':
        return <Building className="mr-2 h-4 w-4 opacity-70" />;
      case 'remote':
        return <Wifi className="mr-2 h-4 w-4 opacity-70" />;
      case 'hybrid':
      default:
        return <Globe className="mr-2 h-4 w-4 opacity-70" />;
    }
  };
  
  return (
    <Card 
      className={cn("overflow-hidden", onClick && "cursor-pointer hover:shadow-md transition-shadow", className)} 
      onClick={onClick}
    >
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
            {getLocationIcon()}
            <span>{location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-gradient-primary" onClick={(e) => {
          e.stopPropagation();
          onClick && onClick();
        }}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
