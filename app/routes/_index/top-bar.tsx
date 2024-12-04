import { Leaf } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center">
        <Leaf className="w-6 h-6 text-green-600 mr-2" />
        <h1 className="text-xl font-bold text-green-800">Plantigo</h1>
      </div>
    </div>
  );
}
