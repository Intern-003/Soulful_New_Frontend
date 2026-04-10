const AboutIntro = () => {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* LEFT SIDE */}
          <div className="transition-all duration-500 hover:translate-x-1">
            <p className="text-sm font-semibold text-pink-600 uppercase tracking-wide mb-3">
              About Our Company
            </p>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem.
            </h2>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative group">
            
            {/* Vertical Line */}
            <div className="hidden md:block absolute left-0 top-0 h-full w-[2px] bg-pink-600 transition-all duration-500 group-hover:h-[110%]"></div>

            <p className="text-gray-600 text-base leading-7 md:pl-6 transition-all duration-300">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutIntro;