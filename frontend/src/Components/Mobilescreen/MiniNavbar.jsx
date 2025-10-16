import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MiniNavbar = () => {
    const navLinks = [
        { name: "WOMAN", path: "/women" },
        { name: "MAN", path: "/man" },
        { name: "UNISEX", path: "/unisex" },
        { name: "SPECIAL OFFERS", path: "/offers" },
    ];

    return (
        <AnimatePresence>
            <motion.div
                key="bottomNav"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28 }}
                className="hidden lg:flex justify-center border-t border-gray-700 text-sm overflow-hidden bg-black"
            >
                {navLinks.map((link, idx) => (
                    <motion.div
                        key={link.name}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.22 }}
                    >
                        <Link
                            to={link.path}
                            className={`px-4 py-3 block ${link.name === "SPECIAL OFFERS"
                                ? "text-red-500 font-semibold"
                                : "text-white hover:text-gray-300"
                                }`}
                        >
                            {link.name}
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </AnimatePresence>
    );
};

export default MiniNavbar;
