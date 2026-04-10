const AboutTestimonial = () => {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* LEFT CONTENT */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Sed ut perspiciatis unde omnis iste natus
            </h2>

            <p className="text-gray-600 leading-7 mb-6">
              Proin iaculis purus consequat sem cure digni ssim donec porttitora
              entum suscipit rhoncus. Accusantium quam, ultricies eget id,
              aliquam eget nibh et. Maecen aliquam, risus at semper.
            </p>

            {/* USER */}
            <div className="flex items-center gap-4">
              <img
                src="/images/testimonial-user.jpg"
                alt="user"
                className="w-12 h-12 rounded-full object-cover"
              />

              <div>
                <h4 className="font-semibold text-gray-800">
                  Saul Goodman
                </h4>
                <p className="text-sm text-gray-500">Client</p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative group">
            <img
              src="/images/testimonial.jpg"
              alt="testimonial"
              className="w-full rounded-2xl shadow-md transition duration-500 group-hover:scale-[1.02]"
            />

            {/* Optional overlay effect */}
            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-pink-200 transition"></div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutTestimonial;