import { motion } from "framer-motion";
import {
  BarChart3,
  CreditCard,
  Users,
  Truck,
  Shield,
  TrendingUp,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "./helper";

const PlatformFeatures = () => {
  // Feature list with icons
  const features = [
    {
      icon: CreditCard,
      text: "Secure and flexible payment options (including BNPL)",
    },
    {
      icon: Users,
      text: "Seller dashboards for inventory and order management",
    },
    { icon: Truck, text: "Integrated logistics and delivery support" },
    {
      icon: Shield,
      text: "Ratings and review system to build marketplace trust",
    },
    { icon: TrendingUp, text: "Smart search and discovery tools" },
    {
      icon: BarChart3,
      text: "Data insights to help sellers optimize performance",
    },
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
          >
            Key Platform Features
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Built with local market realities in mind
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.03 }}
              className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300"
            >
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <p className="text-foreground">{feature.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformFeatures;
