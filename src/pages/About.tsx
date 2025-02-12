export function About() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-ginger-700 mb-6">About e-Salabat IoT System</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-ginger-600 mb-4">Our Innovation</h2>
          <p className="text-ginger-700">
            E-Salabat is an IoT-Based Machine for Powderization of Ginger Extract, designed to innovate, automate, and optimize salabat production through advanced technology and real-time monitoring.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-ginger-600 mb-4">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-salabat-50 rounded-lg">
              <h3 className="text-lg font-semibold text-ginger-700 mb-2">IoT Integration</h3>
              <p className="text-ginger-600">Real-time monitoring of temperature, humidity, and grinding speed parameters for optimal production conditions.</p>
            </div>
            <div className="p-4 bg-salabat-50 rounded-lg">
              <h3 className="text-lg font-semibold text-ginger-700 mb-2">Automated Processing</h3>
              <p className="text-ginger-600">Efficient powderization process with reduced manual labor and increased productivity.</p>
            </div>
            <div className="p-4 bg-salabat-50 rounded-lg">
              <h3 className="text-lg font-semibold text-ginger-700 mb-2">Quality Control</h3>
              <p className="text-ginger-600">FDA-approved production process ensuring high-quality salabat powder output.</p>
            </div>
            <div className="p-4 bg-salabat-50 rounded-lg">
              <h3 className="text-lg font-semibold text-ginger-700 mb-2">Smart Maintenance</h3>
              <p className="text-ginger-600">Automated scheduling and notifications for cleaning, maintenance, and important duties.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-ginger-600 mb-4">Sustainability Goals</h2>
          <ul className="list-disc list-inside space-y-2 text-ginger-700">
            <li>Supporting SDG 8: Decent Work and Economic Growth through increased productivity</li>
            <li>Contributing to SDG 9: Industry, Innovation, and Infrastructure</li>
            <li>Advancing SDG 12: Responsible Consumption and Production</li>
            <li>Empowering local ginger farmers and producers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-ginger-600 mb-4">Benefits</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-ginger-700">For Producers</h3>
              <ul className="list-disc list-inside text-ginger-600">
                <li>Reduced labor costs</li>
                <li>Increased production efficiency</li>
                <li>Consistent product quality</li>
                <li>Real-time process monitoring</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-ginger-700">For Farmers</h3>
              <ul className="list-disc list-inside text-ginger-600">
                <li>Higher demand for raw materials</li>
                <li>Better market opportunities</li>
                <li>Sustainable farming practices</li>
                <li>Improved income potential</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}