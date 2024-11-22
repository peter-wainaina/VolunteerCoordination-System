import React, { useState, useEffect } from 'react';
import Background from '../background/background';
import Navbar from '../navbar/navbar';
import Hero from '../hero/hero';
import { motion } from "framer-motion";


const Aap = () => {
    
    let heroData = [ 
        { text1: 'Its a portal for volunteers to connect with the nonprofits',text2: 'and in a way, its its own search engine specifically for volunteer opportunities.'},
        { text1: 'We connect companies of all sizes with real-time,',text2: 'community-sourced volunteer opportunities' },
        { text1: 'Get connected to qualified volunteers',text2: 'when and where you need them' },
        { text1: 'We empower individuals to give back through meaningful,', text2: 'community-driven volunteer opportunities.' }

    ];
   
    const [heroCount, setHeroCount] = useState(0);
    //the playStatus fuction is used to control whether the transition are active
    const [playStatus, setPlayStatus] = useState(false); 
    //the setDirection function checks the direction of the transition
    const [direction, setDirection] = useState(1); 

    useEffect(() => {
        if (!playStatus) {
            const interval = setInterval(() => {
                setDirection(heroCount === 3 ? -1 : 1); 
                setHeroCount((count) => (count === 3 ? 0 : count + 1));
            }, 8000);
            return () => clearInterval(interval);
        }
    }, [heroCount, playStatus]);

    return (
        <div>
            {/* Background and Navbar */}
            <Background playStatus={playStatus} heroCount={heroCount} />
            <Navbar />

            {/* Hero text transition */}
            <motion.div
                key={heroCount}
                initial={{ x: direction === 1 ? -1000 : 1000, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction === 1 ? 1000 : -1000, opacity: 0 }}
                transition={{ duration: 1.5 }}
            >
                <Hero setPlayStatus={setPlayStatus} heroData={heroData[heroCount]}
                    heroCount={heroCount}
                    setHeroCount={setHeroCount}
                    playStatus={playStatus}
                />
            </motion.div>
        </div>
    );
};

export default Aap;
