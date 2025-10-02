import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BrewingSchedule as BrewingScheduleType, Recipe } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function BrewingScheduleWidget() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    recipeId: "",
    startDate: "",
    endDate: "",
  });

  const { data: schedules, isLoading } = useQuery<BrewingScheduleType[]>({
    queryKey: ['/api/schedules'],
  });

  const { data: recipes } = useQuery<Recipe[]>({
    queryKey: ['/api/recipes'],
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { breweryId } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          recipeId: parseInt(formData.recipeId),
          breweryId,
          status: "Scheduled",
        }),
      });

      if (!response.ok) throw new Error('Failed to create schedule');

      await queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });

      toast({
        title: "Success",
        description: "Brew scheduled successfully!",
      });

      setIsAddDialogOpen(false);
      setFormData({ title: "", recipeId: "", startDate: "", endDate: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule brew. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const formatScheduleTime = (startDate: string | Date, endDate: string | Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // If the date is today
    const today = new Date();
    if (start.toDateString() === today.toDateString()) {
      return `Today, ${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
    }
    
    // If the date is tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (start.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
    }
    
    // Otherwise show the date
    return `${format(start, 'MMM d')}, ${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
  };
  
  const getBorderColor = (status: string) => {
    return status === "In progress" ? "border-primary-light" : "border-secondary";
  };
  
  const getBgColor = (status: string) => {
    return status === "In progress" ? "bg-primary-light bg-opacity-5" : "bg-secondary bg-opacity-5";
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">Brewing Schedule</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary-dark">
              <Plus className="h-4 w-4 mr-1" />
              New Brew
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Brew</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Brew Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Summer IPA Batch #5"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipe">Recipe *</Label>
                  <Select
                    value={formData.recipeId}
                    onValueChange={(value) => setFormData({ ...formData, recipeId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a recipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipes?.map((recipe) => (
                        <SelectItem key={recipe.id} value={recipe.id.toString()}>
                          {recipe.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-dark">
                  Schedule Brew
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-neutral-500">{format(new Date(), 'MMMM yyyy')}</h3>
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost" className="p-1 h-8 w-8">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous month</span>
            </Button>
            <Button size="sm" variant="ghost" className="p-1 h-8 w-8">
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-l-4 border-neutral-300 p-3 rounded-r-lg">
                <Skeleton className="h-5 w-36 mb-2" />
                <Skeleton className="h-4 w-48 mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {schedules?.map((schedule) => (
              <div
                key={schedule.id}
                className={`border-l-4 ${getBorderColor(schedule.status)} p-3 ${getBgColor(schedule.status)} rounded-r-lg`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-neutral-800">{schedule.recipeName}</h4>
                    <p className="text-sm text-neutral-500 mt-1">
                      {formatScheduleTime(schedule.startDate, schedule.endDate)}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      schedule.status === "In progress"
                        ? "bg-primary bg-opacity-10 text-primary border-0"
                        : "bg-neutral-200 text-neutral-700 border-0"
                    }
                  >
                    {schedule.status}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">{schedule.batchNumber}</span>
                  <Button variant="link" size="sm" className="text-xs p-0 h-auto text-neutral-600 hover:text-neutral-900">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-center mt-4">
          <Link href="/schedule">
            <Button variant="link" className="text-primary hover:text-primary-dark">
              View Full Calendar
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
