import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "./helper";

const CTASection = () => {


  return (
    <section className="py-20 px-4 bg-primary text-primary-foreground">
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              Start Selling Today
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Contact Our Team
            </motion.button>
          </motion.div>
        </motion.div>
      </section>
  );
};

export default CTASection;
