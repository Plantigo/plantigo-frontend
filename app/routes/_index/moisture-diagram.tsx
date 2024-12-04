interface MoistureDiagramProps {
  moisture: number;
}

export default function MoistureDiagram({ moisture }: MoistureDiagramProps) {
  const circumference = 2 * Math.PI * 90; // 90 is the radius
  const offset = circumference - (moisture / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <circle
            className="text-green-200"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="90"
            cx="100"
            cy="100"
          />
          <circle
            className="text-green-500"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="90"
            cx="100"
            cy="100"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-green-700">{moisture}%</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h2 className="text-xl font-semibold text-green-800">
          Soil Moisture Level
        </h2>
        <p className="text-sm text-gray-600">
          Current moisture content in the soil
        </p>
      </div>
    </div>
  );
}
