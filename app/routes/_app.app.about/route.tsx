import { type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "About Plantigo" },
    { name: "description", content: "Your personal plant care companion" },
  ];
};

export default function AboutRoute() {
  return (
    <div className="px-8 py-8 rounded-lg">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">About Plantigo</h1>
          <p className="mt-2 text-gray-600">
            Making plant care simple and enjoyable
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <p className="text-gray-600">
              Plantigo is your personal plant care companion, designed to help
              everyone create thriving gardens regardless of experience. We
              combine smart tracking tools with expert guidance to make plant
              care accessible and rewarding.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">
                Smart Tracking
              </h3>
              <p className="text-sm text-gray-600">
                Keep track of watering, fertilization, and growth with our
                intuitive tools
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-1">Expert Tips</h3>
              <p className="text-sm text-gray-600">
                Access care guides and connect with our community of plant
                enthusiasts
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
