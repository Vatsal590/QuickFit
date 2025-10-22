import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { DayMealPlan, GroceryItem } from '@/types/meal';

interface GroceryListProps {
  weekPlan: DayMealPlan[];
}

const GroceryList = ({ weekPlan }: GroceryListProps) => {
  const groceryList = useMemo(() => {
    const ingredientMap = new Map<string, GroceryItem>();

    weekPlan.forEach(day => {
      Object.values(day.meals).forEach(mealOptions => {
        mealOptions.forEach(meal => {
          meal.ingredients.forEach(ingredient => {
            const key = `${ingredient.name}-${ingredient.unit}`;
            const existing = ingredientMap.get(key);
            
            if (existing) {
              existing.amount += ingredient.amount;
            } else {
              ingredientMap.set(key, {
                name: ingredient.name,
                amount: ingredient.amount,
                unit: ingredient.unit,
                category: categorizeIngredient(ingredient.name)
              });
            }
          });
        });
      });
    });

    return Array.from(ingredientMap.values())
      .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  }, [weekPlan]);

  const categorizeIngredient = (name: string): string => {
    const lowerName = name.toLowerCase();
    
    if (['chicken', 'beef', 'pork', 'lamb', 'turkey', 'salmon', 'fish', 'shrimp', 'scallops', 'tuna'].some(m => lowerName.includes(m))) {
      return 'Proteins';
    }
    if (['lettuce', 'spinach', 'broccoli', 'asparagus', 'cucumber', 'tomatoes', 'bell peppers', 'onions', 'carrot', 'mixed vegetables'].some(v => lowerName.includes(v))) {
      return 'Vegetables';
    }
    if (['apple', 'berries', 'banana', 'mango', 'lemon', 'lime'].some(f => lowerName.includes(f))) {
      return 'Fruits';
    }
    if (['rice', 'quinoa', 'pasta', 'bread', 'oat', 'noodles', 'tortilla'].some(g => lowerName.includes(g))) {
      return 'Grains';
    }
    if (['milk', 'yogurt', 'cheese', 'paneer', 'butter', 'ghee', 'cream'].some(d => lowerName.includes(d))) {
      return 'Dairy';
    }
    if (['tofu', 'tempeh', 'lentils', 'beans', 'chickpeas', 'edamame'].some(l => lowerName.includes(l))) {
      return 'Legumes';
    }
    if (['eggs'].some(e => lowerName.includes(e))) {
      return 'Eggs';
    }
    if (['nuts', 'seeds', 'peanuts', 'cashews', 'almonds', 'walnuts'].some(n => lowerName.includes(n))) {
      return 'Nuts & Seeds';
    }
    if (['oil', 'sauce', 'dressing', 'spices', 'honey', 'tahini', 'hummus'].some(c => lowerName.includes(c))) {
      return 'Condiments & Oils';
    }
    
    return 'Other';
  };

  const groupedGroceries = useMemo(() => {
    const grouped: Record<string, GroceryItem[]> = {};
    
    groceryList.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    
    return grouped;
  }, [groceryList]);

  const categoryOrder = ['Proteins', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Legumes', 'Eggs', 'Nuts & Seeds', 'Condiments & Oils', 'Other'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Weekly Grocery List
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          All ingredients needed for your 7-day meal plan
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categoryOrder.map(category => {
            const items = groupedGroceries[category];
            if (!items || items.length === 0) return null;

            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{category}</Badge>
                  <span className="text-xs text-muted-foreground">({items.length} items)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {items.map((item, idx) => (
                    <div
                      key={`${item.name}-${idx}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.ceil(item.amount)} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroceryList;
