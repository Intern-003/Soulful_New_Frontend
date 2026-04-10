const features = [
  {
    title: "Ut enim ad minima veniam",
    desc: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
    img: "/images/about-1.jpg",
    btn: "Explore More",
  },
  {
    title: "Quis autem vel eum iure",
    desc: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",
    img: "/images/about-2.jpg",
    btn: "Learn More",
  },
  {
    title: "Nam libero tempore",
    desc: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.",
    img: "/images/about-3.jpg",
    btn: "Discover More",
  },
];

const AboutFeatures = () => {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              
              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-60 object-cover transform group-hover:scale-110 transition duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-pink-600 transition">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm leading-6 mb-5">
                  {item.desc}
                </p>

                {/* Button */}
                <button className="text-pink-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                  {item.btn}
                  <span className="text-lg">→</span>
                </button>
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default AboutFeatures;