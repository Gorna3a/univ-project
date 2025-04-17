// src/components/FooterSection.tsx
const FooterSection = () => {
  return (
    <footer className=" text-center text-white">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-gray-400 mb-4">
          © 2023 LearnJava. All rights reserved.
        </p>
        <div className="mt-4">
          <a
            href="#"
            className="text-green-500 hover:underline mx-2 transition duration-300"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-green-500 hover:underline mx-2 transition duration-300"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

  