import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { LoadingTransition } from '../ui/LoadingTransition';
import { ChevronLeft, ChevronRight, Menu, X, Plus, Trash2 } from 'lucide-react';
import { OnboardingData, Restaurant, MenuCategory, Product, User } from '../../types';
import { mockApiDelay } from '../../utils/supabase';

const initialRestaurant: Restaurant = {
  name: '',
  businessType: '',
  address: '',
  phone: '',
  email: ''
};

const initialWhatsApp = {
  number: '',
  welcomeMessage: 'Welcome to your order bot!',
  autoReply: true
};

export const OnboardingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant>(initialRestaurant);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [whatsapp, setWhatsapp] = useState(initialWhatsApp);
  const [users, setUsers] = useState<Omit<User, 'id' | 'restaurantId'>[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form states for adding items
  const [newCategory, setNewCategory] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', price: '', categoryId: '' });
  const [newUser, setNewUser] = useState({ name: '', role: '' as 'admin' | 'manager' | 'attendant' | '', permissions: [] as string[] });

  const { user, hasRestaurant } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    if (hasRestaurant()) {
      navigate('/dashboard');
      return;
    }

    if (user.email && !restaurant.email) {
      setRestaurant(prev => ({ ...prev, email: user.email! }));
    }
  }, [user, navigate, hasRestaurant, restaurant.email]);

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!restaurant.name.trim()) newErrors.name = 'Restaurant name is required';
    if (!restaurant.businessType) newErrors.businessType = 'Business type is required';
    if (!restaurant.address.trim()) newErrors.address = 'Address is required';
    if (!restaurant.phone.trim()) newErrors.phone = 'Phone is required';
    if (!restaurant.email.trim()) newErrors.email = 'Email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    if (categories.length === 0) {
      alert('Please add at least one category');
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!whatsapp.number.trim()) newErrors.number = 'WhatsApp number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 1: return validateStep1();
      case 2: return validateStep2();
      case 3: return validateStep3();
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    setErrors({});
    if (canGoNext()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    if (!canGoNext()) return;

    setIsLoading(true);

    const onboardingData: OnboardingData = {
      restaurant,
      categories,
      products,
      whatsapp,
      users
    };

    try {
      console.log('🏪 Saving restaurant data:', onboardingData.restaurant);
      await mockApiDelay(800);

      console.log('📱 Setting up WhatsApp integration:', onboardingData.whatsapp);
      await mockApiDelay(600);

      console.log('🍽️ Creating menu categories:', onboardingData.categories);
      console.log('🍕 Adding menu products:', onboardingData.products);
      await mockApiDelay(700);

      console.log('👥 Creating user accounts:', onboardingData.users);
      await mockApiDelay(900);

      console.log('✅ Onboarding completed successfully!');
      
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Error during onboarding:', error);
      alert('Error saving data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for Step 2
  const addCategory = () => {
    if (!newCategory.trim()) return;
    const category: MenuCategory = {
      id: `cat-${Date.now()}`,
      name: newCategory.trim()
    };
    setCategories([...categories, category]);
    setNewCategory('');
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    setProducts(products.filter(prod => prod.categoryId !== id));
  };

  const addProduct = () => {
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.categoryId) return;
    const product: Product = {
      id: `prod-${Date.now()}`,
      categoryId: newProduct.categoryId,
      name: newProduct.name.trim(),
      price: parseFloat(newProduct.price)
    };
    setProducts([...products, product]);
    setNewProduct({ name: '', price: '', categoryId: '' });
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(prod => prod.id !== id));
  };

  // Helper functions for Step 4
  const addUser = () => {
    if (!newUser.name.trim() || !newUser.role) return;
    const user: Omit<User, 'id' | 'restaurantId'> = {
      name: newUser.name.trim(),
      email: `${newUser.name.toLowerCase().replace(/\s+/g, '.')}@restaurant.com`,
      role: newUser.role
    };
    setUsers([...users, user]);
    setNewUser({ name: '', role: '' as any, permissions: [] });
  };

  const removeUser = (index: number) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const sendInvite = () => {
    alert('Invites sent!');
  };

  const testConnection = () => {
    alert('Connection successful!');
  };

  const renderProgressBar = () => {
    const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index + 1 <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <span className={`ml-2 text-sm ${
                index + 1 <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {step}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-4 ${
                  index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Restaurant Info</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Restaurant Name"
            value={restaurant.name}
            onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <select
            value={restaurant.businessType}
            onChange={(e) => setRestaurant({ ...restaurant, businessType: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Business Type</option>
            <option value="restaurant">Restaurant</option>
            <option value="lanchonete">Lanchonete</option>
            <option value="pizzaria">Pizzaria</option>
          </select>
          {errors.businessType && <p className="mt-1 text-sm text-red-500">{errors.businessType}</p>}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Phone"
            value={restaurant.phone}
            onChange={(e) => setRestaurant({ ...restaurant, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
        </div>

        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Address"
            value={restaurant.address}
            onChange={(e) => setRestaurant({ ...restaurant, address: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
        </div>

        <div className="md:col-span-2">
          <input
            type="email"
            placeholder="Email"
            value={restaurant.email}
            onChange={(e) => setRestaurant({ ...restaurant, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Menu Setup</h2>
      
      {/* Add Category */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Category name (e.g., Main Dishes)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={addCategory}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Categories List */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700">Categories:</h3>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between bg-white p-3 border border-gray-200 rounded-lg">
              <span>{category.name}</span>
              <button
                onClick={() => removeCategory(category.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Product */}
      {categories.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <select
              value={newProduct.categoryId}
              onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Product name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={addProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add Product
            </button>
          </div>
        </div>
      )}

      {/* Products List */}
      {products.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700">Products:</h3>
          {products.map((product) => {
            const category = categories.find(c => c.id === product.categoryId);
            return (
              <div key={product.id} className="flex items-center justify-between bg-white p-3 border border-gray-200 rounded-lg">
                <div>
                  <span className="font-medium">{product.name}</span>
                  <span className="text-gray-500 ml-2">({category?.name})</span>
                  <span className="text-green-600 ml-2">${product.price}</span>
                </div>
                <button
                  onClick={() => removeProduct(product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">WhatsApp Setup</h2>
      
      <div className="space-y-4">
        <div>
          <input
            type="tel"
            placeholder="WhatsApp Business Number"
            value={whatsapp.number}
            onChange={(e) => setWhatsapp({ ...whatsapp, number: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.number && <p className="mt-1 text-sm text-red-500">{errors.number}</p>}
        </div>

        <div>
          <textarea
            placeholder="Bot Greeting"
            value={whatsapp.welcomeMessage}
            onChange={(e) => setWhatsapp({ ...whatsapp, welcomeMessage: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={testConnection}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Test Connection
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Config</h2>
      
      {/* Add User */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="User name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="attendant">Attendant</option>
          </select>
          <button
            onClick={addUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add User
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">Permissions:</p>
          <div className="flex flex-wrap gap-2">
            {['Manage Orders', 'View Reports', 'Manage Menu', 'Manage Users'].map((permission) => (
              <label key={permission} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                />
                <span className="text-sm text-gray-700">{permission}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Users List */}
      {users.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-700">Users:</h3>
            <button
              onClick={sendInvite}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Send Invite
            </button>
          </div>
          {users.map((user, index) => (
            <div key={index} className="flex items-center justify-between bg-white p-3 border border-gray-200 rounded-lg">
              <div>
                <span className="font-medium">{user.name}</span>
                <span className="text-gray-500 ml-2">({user.role})</span>
              </div>
              <button
                onClick={() => removeUser(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  return (
    <LoadingTransition duration={600}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="https://via.placeholder.com/50x50/6B7280/FFFFFF?text=RG" 
                alt="Logo" 
                className="w-12 h-12 rounded"
              />
              <h1 className="text-xl font-bold text-gray-800">RestauranteGestao</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Login
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full">
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              {renderProgressBar()}
              {renderCurrentStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center px-4 py-2 text-gray-600 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Finishing...' : 'Finish'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-bold mb-4">RestauranteGestao</h3>
              <p className="text-gray-300">Your all-in-one solution for restaurant management</p>
            </div>

            {/* Links */}
            <div>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">About Us</a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="space-y-2">
                <p className="text-gray-300">Email: contact@restaurantegestao.com</p>
                <p className="text-gray-300">Phone: +55 11 99999-9999</p>
                <div className="flex space-x-4 mt-4">
                  <span className="text-white text-xl cursor-pointer hover:text-gray-300">🐦</span>
                  <span className="text-white text-xl cursor-pointer hover:text-gray-300">📘</span>
                  <span className="text-white text-xl cursor-pointer hover:text-gray-300">📷</span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </footer>
      </div>
    </LoadingTransition>
  );
};