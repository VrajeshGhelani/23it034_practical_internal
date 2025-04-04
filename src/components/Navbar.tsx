
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Image, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="border-b py-4 bg-white shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">PixelPress</span>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={location.pathname === "/" ? "default" : "outline"}
            asChild
          >
            <Link to="/" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Compress</span>
            </Link>
          </Button>
          
          <Button
            variant={location.pathname === "/analytics" ? "default" : "outline"}
            asChild
          >
            <Link to="/analytics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Analytics</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
