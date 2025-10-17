import { useState } from "react";
import { ArrowLeft, CreditCard, Truck, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";

interface CheckoutProps {
  onBack?: () => void;
  onOrderComplete?: (orderId: string) => void;
}

export default function Checkout({ 
  onBack = () => {}, 
  onOrderComplete = () => {} 
}: CheckoutProps) {
  const { cartItems, clearCart } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "United States",
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    saveInfo: false
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const orderId = `ORD-${Date.now()}`;
    clearCart();
    navigate(`/order-confirmation/${orderId}`);
  };

  const steps = [
    { id: 1, title: "Information", description: "Contact & shipping details" },
    { id: 2, title: "Payment", description: "Payment method & billing" },
    { id: 3, title: "Review", description: "Review your order" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Checkout</h1>
              <p className="text-muted-foreground">Complete your purchase</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((stepItem, index) => (
              <div key={stepItem.id} className="flex items-center">
                <div className={`flex items-center gap-2 ${
                  step >= stepItem.id ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step >= stepItem.id 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'border-muted-foreground'
                  }`}>
                    {step > stepItem.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      stepItem.id
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-medium">{stepItem.title}</p>
                    <p className="text-sm text-muted-foreground">{stepItem.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    step > stepItem.id ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{steps[step - 1].title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {step === 1 && (
                    <>
                      <div className="space-y-4">
                        <h3 className="font-semibold">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="john@example.com"
                            />
                          </div>
                          <div></div>
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              placeholder="John"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              placeholder="Doe"
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="font-semibold">Shipping Address</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="address">Address</Label>
                            <Input
                              id="address"
                              value={formData.address}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                              placeholder="123 Main Street"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                placeholder="New York"
                              />
                            </div>
                            <div>
                              <Label htmlFor="zipCode">ZIP Code</Label>
                              <Input
                                id="zipCode"
                                value={formData.zipCode}
                                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                placeholder="10001"
                              />
                            </div>
                            <div>
                              <Label htmlFor="country">Country</Label>
                              <Input
                                id="country"
                                value={formData.country}
                                onChange={(e) => handleInputChange('country', e.target.value)}
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="space-y-4">
                        <h3 className="font-semibold">Payment Method</h3>
                        <RadioGroup 
                          value={formData.paymentMethod} 
                          onValueChange={(value) => handleInputChange('paymentMethod', value)}
                        >
                          <div className="flex items-center space-x-2 p-4 border rounded-lg">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                              <CreditCard className="h-4 w-4" />
                              Credit Card
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {formData.paymentMethod === 'card' && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                              id="cardNumber"
                              value={formData.cardNumber}
                              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                              placeholder="1234 5678 9012 3456"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiryDate">Expiry Date</Label>
                              <Input
                                id="expiryDate"
                                value={formData.expiryDate}
                                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                placeholder="MM/YY"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                value={formData.cvv}
                                onChange={(e) => handleInputChange('cvv', e.target.value)}
                                placeholder="123"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="saveInfo" 
                          checked={formData.saveInfo}
                          onCheckedChange={(checked) => handleInputChange('saveInfo', checked)}
                        />
                        <Label htmlFor="saveInfo">Save payment information for future purchases</Label>
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4">Order Summary</h3>
                        <div className="space-y-4">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h3 className="font-semibold mb-2">Shipping Information</h3>
                        <p>{formData.firstName} {formData.lastName}</p>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.zipCode}</p>
                        <p>{formData.country}</p>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h3 className="font-semibold mb-2">Payment Method</h3>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Credit Card ending in {formData.cardNumber.slice(-4)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-6">
                    {step > 1 && (
                      <Button variant="outline" onClick={() => setStep(step - 1)}>
                        Back
                      </Button>
                    )}
                    <div className="ml-auto">
                      {step < 3 ? (
                        <Button onClick={() => setStep(step + 1)}>
                          Continue
                        </Button>
                      ) : (
                        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                          Complete Order
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <Badge 
                            variant="secondary" 
                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {item.quantity}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                        </div>
                        <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Truck className="h-4 w-4" />
                      <span>Free shipping on orders over $50</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Shield className="h-4 w-4" />
                      <span>Secure checkout</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}