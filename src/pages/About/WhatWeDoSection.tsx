import { motion } from "framer-motion";
import { 
  Users,
  Globe,
  HeartHandshake,
  TrendingUp,
} from "lucide-react";
import { fadeInUp, scaleIn, staggerContainer } from "./helper";

const WhatWeDoSection = () => {


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
                What 9jacart Does
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
              >
                A full-service transactional marketplace connecting Africa's
                digital economy
              </motion.p>
            </motion.div>
  
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                {
                  title: "Buyers to Verified Merchants",
                  icon: Users,
                  color: "bg-blue-500/10 text-blue-600",
                },
                {
                  title: "Businesses to Wider Markets",
                  icon: Globe,
                  color: "bg-green-500/10 text-green-600",
                },
                {
                  title: "Service Providers to Demand",
                  icon: HeartHandshake,
                  color: "bg-purple-500/10 text-purple-600",
                },
                {
                  title: "Brands to Digital Channels",
                  icon: TrendingUp,
                  color: "bg-orange-500/10 text-orange-600",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ y: -8 }}
                  className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300"
                >
                  <div
                    className={`inline-flex p-3 rounded-lg mb-4 ${item.color}`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
  );
};

export default WhatWeDoSection;
