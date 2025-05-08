
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { categories as allCategories } from '@/data/movies';

interface CategoryTabsProps {
  onSelectCategory: (categoryId: string) => void;
  selectedCategory?: string;
}

const CategoryTabs = ({ onSelectCategory, selectedCategory = 'popular' }: CategoryTabsProps) => {
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  
  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onSelectCategory(categoryId);
  };
  
  return (
    <div className="relative overflow-x-auto pb-2">
      <div className="flex space-x-4 px-4 md:px-6">
        {allCategories.map((category) => (
          <button
            key={category.id}
            className={cn(
              "whitespace-nowrap py-2 text-sm font-medium border-b-2 transition-colors",
              activeCategory === category.id 
                ? "border-disney-accent-blue text-disney-white" 
                : "border-transparent text-disney-gray-500 hover:text-disney-white"
            )}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Fade effect on edges */}
      <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-disney-dark-blue to-transparent" />
    </div>
  );
};

export default CategoryTabs;
