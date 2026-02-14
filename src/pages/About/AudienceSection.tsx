import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeInUp, staggerContainer } from "./helper";

const CTASection = () => {


  return (
    <section className="py-20 px-4 bg-primary/5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container mx-auto max-w-4xl text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
         Enabling Commerce, Empowering Choice
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl mb-8 opacity-90">
            Join us in unlocking opportunity through technology across Africa
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://vendors.9jacart.ng/sell-product"
              target="_blank"
              className="px-8 py-3 bg-[#8DEB6E] text-primary rounded-lg font-medium hover:bg-primary/90 hover:text-white transition-colors inline-flex items-center justify-center"
            >
              Start Selling Today
            </motion.a>
            <Link to="/contact-admin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-[#2ac12a] text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors w-full"
              >
                Contact Our Team
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
  );
};

export default CTASection;
