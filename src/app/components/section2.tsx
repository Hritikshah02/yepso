'use client';

export default function VoltageEngineer() {
  return (
    <div className="relative flex flex-col justify-center items-center p-6 md:p-10 w-full overflow-x-hidden">
      {/* Welcome text */}
      <div
        className="text-black font-bold text-3xl md:text-4xl lg:text-5xl text-center px-4 py-2"
        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
      >
        Welcome to YEPSO ENERGY!
      </div>
      
      {/* Subtitle text */}
      <p className="text-gray-700 text-base md:text-lg text-center px-4 mt-2 max-w-3xl">
        From the very beginning, our focus has been on building brand trust through 
        continuous R&D and exceptional customer service.
      </p>
    </div>
  );
}
