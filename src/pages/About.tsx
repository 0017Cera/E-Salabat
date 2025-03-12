import { PageContainer } from '../components/PageContainer';
import { useNavigate } from 'react-router-dom';

export function About() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <img 
              src="/LogoE-Salabat.png" 
              alt="E-SALABAT" 
              className="h-20 sm:h-28 mx-auto mb-4 sm:mb-6"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-yellow-500 mb-1">
              About
            </h1>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-ginger-600 mb-4">Our Innovation</h2>
              <p className="text-ginger-700 text-justify">
                E-Salabat is an IoT-Based Machine for Powderization of Ginger Extract, designed to innovate, automate, and optimize salabat production through advanced technology and real-time monitoring.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ginger-600 mb-4">Developers</h2>
              <div className="space-y-6">
                {[ 
                  { name: "Ramona D. Alcañeses", role: "Lead Developer", img: "/Ramona.jpg" },
                  { name: "Faith F. Atienza", role: "Lead Programmer", img: "/Faith.jpg" },
                  { name: "Paul Yngwie O. Cabales", role: "Hardware Designer", img: "/Yngwie.jpg" },
                  { name: "Danna A. Gutierrez", role: "Lead Technical Writer", img: "/Dans.jpg" },
                ].map((dev, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <img 
                      src={dev.img} 
                      alt={dev.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-md"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-ginger-700">{dev.name}</h3>
                      <p className="text-ginger-600">{dev.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden shadow-md">
        <div className="flex justify-around p-4">
          <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center text-gray-500">
            <span className="material-icons">home</span>
            <span className="text-xs">Home</span>
          </button>
          <button onClick={() => navigate('/run')} className="flex flex-col items-center text-gray-500">
            <span className="material-icons">play_arrow</span>
            <span className="text-xs">Run</span>
          </button>
          <button onClick={() => navigate('/logs')} className="flex flex-col items-center text-gray-500">
            <span className="material-icons">history</span>
            <span className="text-xs">History</span>
          </button>
          <button onClick={() => navigate('/about')} className="flex flex-col items-center text-yellow-500">
            <span className="material-icons">person</span>
            <span className="text-xs">About</span>
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
