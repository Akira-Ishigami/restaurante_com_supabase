import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { MenuCategory, Product } from '../../../types';
import { Plus, Trash2 } from 'lucide-react';

interface Step2Props {
  categories: MenuCategory[];
  products: Product[];
  onCategoriesChange: (categories: MenuCategory[]) => void;
  onProductsChange: (products: Product[]) => void;
}

export const Step2MenuSetup: React.FC<Step2Props> = ({
  categories,
  products,
  onCategoriesChange,
  onProductsChange
}) => {
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newProduct, setNewProduct] = useState({ 
    categoryId: '', 
    name: '', 
    price: '', 
    description: '' 
  });

  const addCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const category: MenuCategory = {
      id: `cat-${Date.now()}`,
      name: newCategory.name.trim(),
      description: newCategory.description.trim() || undefined
    };
    
    onCategoriesChange([...categories, category]);
    setNewCategory({ name: '', description: '' });
  };

  const removeCategory = (id: string) => {
    onCategoriesChange(categories.filter(cat => cat.id !== id));
    onProductsChange(products.filter(prod => prod.categoryId !== id));
  };

  const addProduct = () => {
    if (!newProduct.name.trim() || !newProduct.categoryId || !newProduct.price) return;
    
    const product: Product = {
      id: `prod-${Date.now()}`,
      categoryId: newProduct.categoryId,
      name: newProduct.name.trim(),
      price: parseFloat(newProduct.price),
      description: newProduct.description.trim() || undefined
    };
    
    onProductsChange([...products, product]);
    setNewProduct({ categoryId: '', name: '', price: '', description: '' });
  };

  const removeProduct = (id: string) => {
    onProductsChange(products.filter(prod => prod.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuração do Cardápio</h2>
        <p className="text-gray-600">Crie categorias e adicione alguns produtos principais</p>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Nome da Categoria"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            placeholder="Ex: Pratos Principais"
          />
          <Input
            label="Descrição (opcional)"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            placeholder="Descrição da categoria"
          />
        </div>
        
        <Button onClick={addCategory} className="mb-4">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Categoria
        </Button>

        {categories.length > 0 && (
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                <div>
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                  {category.description && (
                    <p className="text-sm text-gray-600">{category.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCategory(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Products Section */}
      {categories.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtos</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={newProduct.categoryId}
                onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <Input
              label="Nome do Produto"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Ex: Pizza Margherita"
            />
            
            <Input
              label="Preço (R$)"
              type="number"
              step="0.01"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              placeholder="25.90"
            />
            
            <Input
              label="Descrição (opcional)"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder="Descrição do produto"
            />
          </div>
          
          <Button onClick={addProduct} className="mb-4">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produto
          </Button>

          {products.length > 0 && (
            <div className="space-y-2">
              {categories.map((category) => {
                const categoryProducts = products.filter(p => p.categoryId === category.id);
                if (categoryProducts.length === 0) return null;

                return (
                  <div key={category.id}>
                    <h4 className="font-medium text-gray-900 mb-2">{category.name}</h4>
                    <div className="space-y-1 ml-4">
                      {categoryProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                          <div>
                            <div className="flex items-center gap-4">
                              <span className="font-medium text-gray-900">{product.name}</span>
                              <span className="text-green-600 font-semibold">
                                R$ {product.price.toFixed(2)}
                              </span>
                            </div>
                            {product.description && (
                              <p className="text-sm text-gray-600">{product.description}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};