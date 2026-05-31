import { ConfiguratorProvider } from '../context/ConfiguratorContext';
import WheelPreview from '../components/configurator/WheelPreview';
import OptionsPanel from '../components/configurator/OptionsPanel';

export default function Configurator() {
  return (
    <ConfiguratorProvider>
      <div className="bg-white min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-start">

            <div className="w-full md:w-2/3 rounded-lg overflow-hidden shadow-sm bg-gray-100 relative">
              <WheelPreview />
            </div>

            <div className="w-full md:w-1/3 md:border-l border-gray-200">
              <OptionsPanel />
            </div>

          </div>
        </div>
      </div>
    </ConfiguratorProvider>
  );
}
