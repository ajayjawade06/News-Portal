import { Mail, Phone, MessageCircle } from "lucide-react";

const ReporterHighlight = () => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 my-10 max-w-sm mx-auto hover:shadow-xl transition-all duration-300">

      {/* 4:3 Image */}
      <div className="w-full aspect-[4/3] overflow-hidden rounded-xl">
        <img
          src="/photo/reporter.JPG"
          alt="Dipak Khekare"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="mt-4 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Dipak Khekare
        </h2>

        <p className="text-red-600 font-medium mt-1">
          मुख्य संपादक
        </p>

        {/* Contact */}
        <div className="mt-3 text-sm text-gray-600 space-y-1">
          <p className="flex justify-center items-center gap-2">
            <Mail size={16} /> dipakkhekare1@gmail.com
          </p>
          <p className="flex justify-center items-center gap-2">
            <Phone size={16} /> +91 7972337485
          </p>
        </div>

        {/* WhatsApp Join Section */}
        <a
          href="https://chat.whatsapp.com/FNzuitTbKlfFJeIBvn6Sp9?mode=gi_t"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition duration-300 w-full"
        >
          <MessageCircle size={18} />
          Join WhatsApp Channel
        </a>

      </div>
    </div>
  );
};

export default ReporterHighlight;