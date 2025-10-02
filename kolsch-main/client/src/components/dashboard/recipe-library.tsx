import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Recipe } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function RecipeLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    ingredients: [] as string[],
    instructions: [] as string[],
    description: "",
  });

  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: ['/api/recipes'],
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { breweryId } = useAuth();
  const [, navigate] = useLocation();

  // Filter recipes based on search term
  const filteredRecipes = recipes?.filter(recipe =>
    recipe.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          breweryId,
        }),
      });

      if (!response.ok) throw new Error('Failed to create recipe');

      await queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });

      toast({
        title: "Success",
        description: "Recipe created successfully!",
      });

      setIsAddDialogOpen(false);
      setFormData({ name: "", ingredients: [], instructions: [], description: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create recipe. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">Recipe Library</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Add</span> Recipe
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Recipe</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Recipe Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  You can add detailed ingredients and instructions after creating the recipe.
                </p>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-dark">
                  Create Recipe
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search recipes..."
            className="pl-9"
          />
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex space-x-4">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-14" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecipes?.slice(0, 3).map((recipe) => (
              <div key={recipe.id} className="p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition cursor-pointer">
                <div className="flex justify-between">
                  <h4 className="font-medium text-neutral-800">{recipe.name}</h4>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-700 border-0"
                  >
                    {recipe.style}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-500 mt-1 line-clamp-1">{recipe.description || 'No description available'}</p>
                <div className="flex items-center mt-2 text-xs space-x-4 text-neutral-500">
                  <span>ABV: {recipe.targetAbv || 'N/A'}%</span>
                  <span>IBU: {recipe.targetIbu || 'N/A'}</span>
                  <span>Batch: {recipe.batchSize} L</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-center mt-4">
          <Link href="/recipes">
            <Button variant="link" className="text-primary hover:text-primary-dark">
              View All Recipes
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
