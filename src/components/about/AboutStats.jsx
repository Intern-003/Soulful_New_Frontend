const stats = [
  { number: "232", label: "Happy Clients" },
  { number: "521", label: "Projects" },
  { number: "1453", label: "Hours Of Support" },
  { number: "32", label: "Hard Workers" },
];

const AboutStats = () => {
  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

          {stats.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              
              {/* Number */}
              <h3 className="text-3xl md:text-4xl font-bold text-pink-600 mb-2 transition group-hover:scale-110">
                {item.number}
              </h3>

              {/* Label */}
              <p className="text-gray-600 text-sm md:text-base">
                {item.label}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default AboutStats;