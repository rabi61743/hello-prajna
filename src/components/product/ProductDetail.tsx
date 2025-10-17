import { useState } from "react";
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Product } from "./ProductCard";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
}

interface ProductDetailProps {
  product?: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
  onAddToWishlist?: (product: Product) => void;
}

export default function ProductDetail({
  product,
  onAddToCart = () => {},
  onAddToWishlist = () => {}
}: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Default product for demo
  const defaultProduct: Product = {
    id: "1",
    name: "Wireless Bluetooth Headphones with Active Noise Cancellation",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviewCount: 1247,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    category: "Electronics",
    isNew: true
  };

  const currentProduct = product || defaultProduct;

  const productImages = [
    currentProduct.image,
    currentProduct.image.replace('?w=800', '?w=800&sat=-100'),
    currentProduct.image.replace('?w=800', '?w=800&hue=180'),
    currentProduct.image.replace('?w=800', '?w=800&brightness=110')
  ];

  const reviews: Review[] = [
    {
      id: "1",
      author: "Sarah Johnson",
      rating: 5,
      date: "2024-01-15",
      title: "Amazing sound quality!",
      content: "These headphones exceeded my expectations. The noise cancellation is superb and the battery life is excellent. Highly recommend!",
      verified: true,
      helpful: 24
    },
    {
      id: "2",
      author: "Mike Chen",
      rating: 4,
      date: "2024-01-10",
      title: "Great value for money",
      content: "Very comfortable to wear for long periods. Sound quality is great, though the bass could be slightly stronger.",
      verified: true,
      helpful: 18
    }
  ];

  const features = [
    "Active Noise Cancellation technology",
    "40-hour battery life",
    "Premium comfort ear cushions",
    "Bluetooth 5.0 connectivity",
    "Built-in microphone for calls",
    "Foldable design with carrying case"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-white">
              <img
                src={productImages[selectedImage]}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${currentProduct.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{currentProduct.category}</Badge>
                {currentProduct.isNew && <Badge className="bg-green-500">New Arrival</Badge>}
              </div>
              <h1 className="text-3xl font-bold mb-4">{currentProduct.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(currentProduct.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{currentProduct.rating}</span>
                <span className="text-muted-foreground">
                  ({currentProduct.reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold">${currentProduct.price.toFixed(2)}</span>
                {currentProduct.originalPrice && (
                  <>
                    <span className="text-2xl text-muted-foreground line-through">
                      ${currentProduct.originalPrice.toFixed(2)}
                    </span>
                    <Badge variant="destructive" className="text-lg">
                      Save {Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)}%
                    </Badge>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center font-medium text-lg">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1" 
                  size="lg"
                  onClick={() => onAddToCart(currentProduct, quantity)}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => onAddToWishlist(currentProduct)}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">2 Year Warranty</p>
                  <p className="text-xs text-muted-foreground">Full coverage</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-sm">30-Day Returns</p>
                  <p className="text-xs text-muted-foreground">Money back guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({currentProduct.reviewCount})</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4 mt-6">
                <h3 className="text-xl font-semibold">Product Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Experience premium audio quality with our advanced wireless headphones. Featuring state-of-the-art 
                  active noise cancellation technology, these headphones deliver an immersive listening experience 
                  whether you're commuting, working, or relaxing at home.
                </p>
                <h4 className="font-semibold mt-4">Key Features:</h4>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Brand", value: "AudioTech" },
                    { label: "Model", value: "AT-NC500" },
                    { label: "Color", value: "Black" },
                    { label: "Connectivity", value: "Bluetooth 5.0" },
                    { label: "Battery Life", value: "40 hours" },
                    { label: "Weight", value: "250g" },
                    { label: "Warranty", value: "2 years" }
                  ].map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{spec.label}:</span>
                      <span className="text-muted-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{currentProduct.rating}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(currentProduct.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">Based on {currentProduct.reviewCount} reviews</p>
                </div>

                <Separator />

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.author}`} />
                            <AvatarFallback>{review.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-semibold">{review.author}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString()}
                                  {review.verified && (
                                    <Badge variant="secondary" className="ml-2 text-xs">
                                      Verified Purchase
                                    </Badge>
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <h4 className="font-semibold mb-2">{review.title}</h4>
                            <p className="text-muted-foreground mb-3">{review.content}</p>
                            <Button variant="ghost" size="sm">
                              Helpful ({review.helpful})
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}