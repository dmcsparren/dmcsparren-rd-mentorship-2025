import React from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart2,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Cpu,
  Download,
  MapPin,
  QrCode,
  ShoppingCart,
  ThumbsUp,
  Layers,
  Mail,
  Phone,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleDemoRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Demo Request Received",
      description: "Our team will contact you shortly to schedule a demo.",
    });

    // Reset the form
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you soon.",
    });

    // Reset the form
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b sticky top-0 z-30 bg-background">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Layers className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">kolsch</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#welcome"
              className="text-sm font-medium hover:text-primary"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </a>
            <a href="#demo" className="text-sm font-medium hover:text-primary">
              Request Demo
            </a>
            <a
              href="#contact"
              className="text-sm font-medium hover:text-primary"
            >
              Contact
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/login")}
            >
              Log In
            </Button>
            <Button onClick={() => navigate("/signup")}>Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section
        id="welcome"
        className="py-20 bg-gradient-to-b from-amber-50 to-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
                Brew Better with kolsch
              </h1>
              <p className="text-lg mb-8 text-neutral-700">
                Comprehensive brewery management software for small breweries.
                Simplify your operations, track ingredients, manage equipment,
                and schedule your brewing process with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate("/signup")}>
                  Get Started <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
              </div>
              <p className="text-sm text-neutral-600 mt-4">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-amber-600 hover:text-amber-700 underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/80 to-amber-300/60 mix-blend-multiply"></div>
              <div className="flex flex-col items-center justify-center h-full text-white p-8 relative z-10">
                <Layers className="h-16 w-16 mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-center">
                  Brewery Management Simplified
                </h3>
                <p className="text-center">
                  Track. Manage. Schedule. All in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Powerful Features for Brewers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run your brewery efficiently and focus on
              what matters most: brewing great beer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <ShoppingCart className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>
                  Keep track of all your ingredients with expiration dates and
                  stock levels.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Barcode scanning support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Automatic stock alerts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Ingredient image uploads</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Brewing Calendar</CardTitle>
                <CardDescription>
                  Schedule and manage your brewing operations with an
                  interactive calendar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Drag-and-drop scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Batch tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Status updates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Ingredient Mapping</CardTitle>
                <CardDescription>
                  Visualize your ingredient sources on an interactive map.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Geographic visualization</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Supplier details</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Distance calculation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart2 className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Price Trends</CardTitle>
                <CardDescription>
                  Track and analyze price trends for your brewing ingredients.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Historical price tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Visual price comparisons</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Seasonal trend analysis</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Cpu className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Equipment Management</CardTitle>
                <CardDescription>
                  Monitor and maintain your brewing equipment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Maintenance scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Usage tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Equipment history logs</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Recipe Management</CardTitle>
                <CardDescription>
                  Store and manage your brewing recipes in one place.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Image gallery for recipes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Detailed instructions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                    <span>Version history</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Request Demo */}
      <section
        id="demo"
        className="py-20 bg-gradient-to-b from-amber-50 to-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Request a Demo</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how kolsch can transform your brewery operations. Fill out the
              form below and we'll contact you to schedule a personalized demo.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleDemoRequest} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-1"
                    >
                      Brewery Name
                    </label>
                    <Input id="name" placeholder="Your brewery name" required />
                  </div>

                  <div>
                    <label
                      htmlFor="contact"
                      className="block text-sm font-medium mb-1"
                    >
                      Contact Person
                    </label>
                    <Input id="contact" placeholder="Your name" required />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium mb-1"
                    >
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      placeholder="Your phone number"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="size"
                      className="block text-sm font-medium mb-1"
                    >
                      Brewery Size
                    </label>
                    <select
                      id="size"
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    >
                      <option value="">Select size</option>
                      <option value="nano">
                        Nano Brewery (less than 3 BBL)
                      </option>
                      <option value="micro">Micro Brewery (3-15 BBL)</option>
                      <option value="small">Small Brewery (15-30 BBL)</option>
                      <option value="regional">
                        Regional Brewery (30+ BBL)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-1"
                    >
                      Message (Optional)
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your specific needs or questions..."
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Request Demo <Download className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions or want to learn more about kolsch? We're here to
              help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-muted-foreground">
                      info@kolsch-brewery.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium">Address</h4>
                    <p className="text-muted-foreground">
                      123 Brewery Lane
                      <br />
                      Portland, OR 97201
                      <br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-primary transition-colors">
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a href="#" className="hover:text-primary transition-colors">
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="hover:text-primary transition-colors">
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6">Send Us a Message</h3>
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="contactName"
                        className="block text-sm font-medium mb-1"
                      >
                        Name
                      </label>
                      <Input
                        id="contactName"
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contactEmail"
                        className="block text-sm font-medium mb-1"
                      >
                        Email
                      </label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contactSubject"
                        className="block text-sm font-medium mb-1"
                      >
                        Subject
                      </label>
                      <Input
                        id="contactSubject"
                        placeholder="How can we help?"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contactMessage"
                        className="block text-sm font-medium mb-1"
                      >
                        Message
                      </label>
                      <Textarea
                        id="contactMessage"
                        placeholder="Your message..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Send Message <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Layers className="h-6 w-6 text-amber-400" />
                <span className="text-xl font-bold text-amber-400">kolsch</span>
              </div>
              <p className="text-neutral-400">
                Brewery management software for small and independent breweries.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#welcome"
                    className="text-neutral-400 hover:text-amber-400 transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-neutral-400 hover:text-amber-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#demo"
                    className="text-neutral-400 hover:text-amber-400 transition-colors"
                  >
                    Request Demo
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-neutral-400 hover:text-amber-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-neutral-400 hover:text-amber-400 transition-colors"
                  >
                    Inventory Management
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-neutral-400 hover:text-amber-400 transition-colors"
                  >
                    Brewing Calendar
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-neutral-400 hover:text-amber-400 transition-colors"
                  >
                    Equipment Tracking
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-neutral-400 hover:text-amber-400 transition-colors"
                  >
                    Price Trends
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-neutral-400 hover:text-amber-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-neutral-400 hover:text-amber-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-neutral-400 hover:text-amber-400 transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 mt-10 pt-6 text-center text-neutral-500">
            <p>
              © {new Date().getFullYear()} kolsch Brewery Management. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
