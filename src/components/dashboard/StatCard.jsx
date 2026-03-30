const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">

      <p className="text-gray-500 text-sm">{title}</p>

      <h2 className="text-xl font-bold mt-1 text-[#7a1c3d]">
        {value}
      </h2>

    </div>
  );
};

export default StatCard;
