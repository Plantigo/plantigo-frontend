import React from "react";
import {
  Leaf,
  Droplets,
  Thermometer,
  Signal,
  ChevronRight,
  Plane as Plant,
  Shield,
  Smartphone,
} from "lucide-react";
import { Link } from "@remix-run/react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f7ed] to-[#d1f2e1]">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-[#00a651]" />
          <span className="text-2xl font-bold text-[#00a651]">Plantigo</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-gray-700 hover:text-[#00a651]"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-gray-700 hover:text-[#00a651]"
          >
            How it works
          </a>
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("pricing")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-gray-700 hover:text-[#00a651]"
          >
            Pricing
          </a>
        </div>
        <Link
          to="/app"
          className="bg-[#00a651] text-white px-6 py-2 rounded-full hover:bg-[#008f45] transition-colors"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Smart Plant Care at Your Fingertips
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Monitor your plants' health in real-time with our IoT-powered
              system. Track soil moisture, temperature, and more to keep your
              plants thriving.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/app"
                className="bg-[#00a651] text-white px-8 py-3 rounded-full hover:bg-[#008f45] transition-colors flex items-center"
              >
                Start Monitoring
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="border-2 border-[#00a651] text-[#00a651] px-8 py-3 rounded-full hover:bg-[#00a651] hover:text-white transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1530968464165-7a1861cbaf9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
              alt="Smart plant monitoring"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16" id="features">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Smart Features for Smarter Plant Care
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Droplets className="h-8 w-8 text-[#00a651]" />}
            title="Soil Moisture Monitoring"
            description="Real-time tracking of soil moisture levels to ensure optimal watering schedules."
          />
          <FeatureCard
            icon={<Thermometer className="h-8 w-8 text-[#00a651]" />}
            title="Temperature Control"
            description="Monitor ambient temperature to maintain the perfect growing environment."
          />
          <FeatureCard
            icon={<Signal className="h-8 w-8 text-[#00a651]" />}
            title="Real-time Analytics"
            description="Get instant insights and notifications about your plants' health status."
          />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-white py-16" id="how-it-works">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How Plantigo Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Step
              number="1"
              icon={<Plant className="h-8 w-8 text-[#00a651]" />}
              title="Connect Your Device"
              description="Set up your Plantigo sensor near your plants in seconds."
            />
            <Step
              number="2"
              icon={<Shield className="h-8 w-8 text-[#00a651]" />}
              title="Monitor Health"
              description="Get real-time data about your plants' vital signs."
            />
            <Step
              number="3"
              icon={<Smartphone className="h-8 w-8 text-[#00a651]" />}
              title="Receive Updates"
              description="Get notifications and care recommendations on your phone."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Step({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="relative inline-block">
        <div className="bg-[#e6f7ed] rounded-full p-6 mb-4 relative">
          {icon}
          <div className="absolute -top-2 -right-2 bg-[#00a651] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
            {number}
          </div>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
