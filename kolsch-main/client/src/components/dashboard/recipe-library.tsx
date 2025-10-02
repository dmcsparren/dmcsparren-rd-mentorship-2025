import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Recipe } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Search, Plus, Trash } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function RecipeLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "Flagship",
    description: "",
    targetAbv: "5.0",
    targetIbu: "25",
    srm: "5.0",
    ingredients: [] as string[],
    instructions: [] as string[],
    imageUrl: "",
  });
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [currentInstruction, setCurrentInstruction] = useState("");

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

  const addIngredient = () => {
    if (currentIngredient.trim()) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, currentIngredient.trim()]
      });
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index)
    });
  };

  const addInstruction = () => {
    if (currentInstruction.trim()) {
      setFormData({
        ...formData,
        instructions: [...formData.instructions, currentInstruction.trim()]
      });
      setCurrentInstruction("");
    }
  };

  const removeInstruction = (index: number) => {
    setFormData({
      ...formData,
      instructions: formData.instructions.filter((_, i) => i !== index)
    });
  };

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
          targetAbv: parseInt(formData.targetAbv),
          targetIbu: parseInt(formData.targetIbu),
          srm: parseFloat(formData.srm),
        }),
      });

      if (!response.ok) throw new Error('Failed to create recipe');

      await queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });

      toast({
        title: "Success",
        description: "Recipe created successfully!",
      });

      setIsAddDialogOpen(false);
      setFormData({
        name: "",
        type: "Flagship",
        description: "",
        targetAbv: "5.0",
        targetIbu: "25",
        srm: "5.0",
        ingredients: [],
        instructions: [],
        imageUrl: "",
      });
      setCurrentIngredient("");
      setCurrentInstruction("");
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Recipe</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="details">Recipe Details</TabsTrigger>
                  <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Recipe Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger id="type" className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Flagship">Flagship</SelectItem>
                        <SelectItem value="Seasonal">Seasonal</SelectItem>
                        <SelectItem value="Experimental">Experimental</SelectItem>
                        <SelectItem value="Limited">Limited Edition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-4 grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="targetAbv">ABV (%)</Label>
                        <Input
                          id="targetAbv"
                          type="number"
                          min="0"
                          step="0.1"
                          value={formData.targetAbv}
                          onChange={(e) => setFormData({ ...formData, targetAbv: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="targetIbu">IBU</Label>
                        <Input
                          id="targetIbu"
                          type="number"
                          min="0"
                          value={formData.targetIbu}
                          onChange={(e) => setFormData({ ...formData, targetIbu: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="srm">SRM</Label>
                        <Input
                          id="srm"
                          type="number"
                          min="0"
                          step="0.1"
                          value={formData.srm}
                          onChange={(e) => setFormData({ ...formData, srm: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">
                      Recipe Image
                    </Label>
                    <div className="col-span-3">
                      <ImageUpload
                        imageUrl={formData.imageUrl}
                        onImageChange={(url) => setFormData({ ...formData, imageUrl: url || "" })}
                        label="Recipe Image"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ingredients" className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="ingredient">Add Ingredient</Label>
                      <Input
                        id="ingredient"
                        value={currentIngredient}
                        onChange={(e) => setCurrentIngredient(e.target.value)}
                        placeholder="e.g. 5kg Pilsner Malt"
                      />
                    </div>
                    <Button type="button" onClick={addIngredient}>Add</Button>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Ingredients List</h3>
                    {formData.ingredients.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No ingredients added yet.</p>
                    ) : (
                      <ul className="space-y-2">
                        {formData.ingredients.map((ingredient, index) => (
                          <li key={index} className="flex justify-between items-center border-b pb-2">
                            <span>{ingredient}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive"
                              onClick={() => removeIngredient(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="instructions" className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="instruction">Add Instruction</Label>
                      <Textarea
                        id="instruction"
                        value={currentInstruction}
                        onChange={(e) => setCurrentInstruction(e.target.value)}
                        placeholder="e.g. Mash at 152°F for 60 minutes"
                        rows={2}
                      />
                    </div>
                    <Button type="button" onClick={addInstruction}>Add</Button>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Brewing Instructions</h3>
                    {formData.instructions.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No instructions added yet.</p>
                    ) : (
                      <ol className="space-y-2 list-decimal list-inside">
                        {formData.instructions.map((instruction, index) => (
                          <li key={index} className="flex justify-between items-start border-b pb-2">
                            <span className="pl-2">{instruction}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive ml-2"
                              onClick={() => removeInstruction(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
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
