import React from 'react'
import Miniherosection from './Mobilescreen/Miniherosection'
import HeroSection from './Herosection'

const Combine = () => {
    return (
        <div>
            <div className=' block md:hidden' >
                <Miniherosection />
            </div>
            <div className=' hidden md:block'>
                <HeroSection />
            </div>
        </div>
    )
}

export default Combine