export function History() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-ginger-700 mb-6">The History of Salabat</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-ginger-600 mb-4">Traditional Origins</h2>
            <p className="text-ginger-700 mb-4">
              Salabat, or ginger tea, has been a staple in Filipino traditional medicine and culture for centuries. This warming beverage has been passed down through generations as both a remedy and a comforting drink.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ginger-600 mb-4">Timeline</h2>
            <div className="space-y-6">
              <div className="flex">
                <div className="w-24 flex-shrink-0 text-salabat-600 font-semibold">Pre-1500s</div>
                <div className="border-l-2 border-salabat-200 pl-4 pb-6">
                  <h3 className="text-lg font-semibold text-ginger-700 mb-2">Ancient Roots</h3>
                  <p className="text-ginger-600">Early use of ginger in traditional Asian medicine and cuisine.</p>
                </div>
              </div>

              <div className="flex">
                <div className="w-24 flex-shrink-0 text-salabat-600 font-semibold">1500s</div>
                <div className="border-l-2 border-salabat-200 pl-4 pb-6">
                  <h3 className="text-lg font-semibold text-ginger-700 mb-2">Cultural Integration</h3>
                  <p className="text-ginger-600">Adoption of ginger tea in Filipino culture through trade and cultural exchange.</p>
                </div>
              </div>

              <div className="flex">
                <div className="w-24 flex-shrink-0 text-salabat-600 font-semibold">Present</div>
                <div className="border-l-2 border-salabat-200 pl-4">
                  <h3 className="text-lg font-semibold text-ginger-700 mb-2">Modern Revival</h3>
                  <p className="text-ginger-600">e-Salabat brings this traditional beverage to the digital age, making it accessible to a global audience while preserving its authentic roots.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}