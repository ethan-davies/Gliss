import React, { useState, useEffect } from 'react'
import hotkeys from 'hotkeys-js'

const netherIdealBlindCoords = {
    firstRing: [
        [0, 220],
        [50, 210],
        [75, 200],
        [100, 190],
        [125, 172],
        [155, 155],
        [220, 0],
        [210, 50],
        [200, 75],
        [190, 100],
        [172, 125],
    ],
    secondRing: [
        [0, 620],
        [100, 610],
        [150, 600],
        [200, 585],
        [250, 565],
        [300, 540],
        [350, 510],
        [435, 435],
        [620, 0],
        [610, 100],
        [600, 150],
        [585, 200],
        [565, 250],
        [540, 300],
        [510, 350],
    ],
    thirdRing: [
        [0, 1010],
        [200, 990],
        [300, 965],
        [400, 930],
        [500, 880],
        [600, 815],
        [715, 715],
        [1010, 0],
        [990, 200],
        [965, 300],
        [930, 400],
        [880, 500],
        [815, 600],
    ],
}

const Console = () => {
    const [output, setOutput] = useState([])

    const logToConsole = (text) => {
        setOutput((prevOutput) => [...prevOutput, text])
    }

    const handleHotkey = async () => {
        logToConsole('Finding closest ideal blind travel coordinates...')
        try {
            const result = findRingAndClosestCoords(
                151,
                604,
                netherIdealBlindCoords,
            )
            console.log(
                `Result: x=${result.x}, z=${result.z}, region=${result.ring}`,
            )
            logToConsole(
                `[COORDINATES] x=${result.x}, z=${result.z}, region=${result.ring}`,
            )
        } catch (error) {
            console.error('Error:', error)
        }
    }

    useEffect(() => {
        const hotkeyHandler = (event, handler) => {
            event.preventDefault()
            handleHotkey()
        }

        hotkeys('f3+c', hotkeyHandler)

        return () => {
            hotkeys.unbind('f3+c', hotkeyHandler)
        }
    }, [output])

    return (
        <div className="console">
            <div className="console-content">
                {output.map((line, index) => (
                    <div key={index} className="console-line">
                        {line}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Console

function findRingAndClosestCoords(x, z, netherIdealBlindCoords) {
    let closestRing = ''
    let closestDistance = Number.MAX_VALUE
    let closestCoords = []

    for (const ring in netherIdealBlindCoords) {
        if (netherIdealBlindCoords.hasOwnProperty(ring)) {
            const ringCoords = netherIdealBlindCoords[ring]
            for (const coords of ringCoords) {
                const distance = Math.sqrt(
                    (x - coords[0]) ** 2 + (z - coords[1]) ** 2,
                )
                if (distance < closestDistance) {
                    closestDistance = distance
                    closestRing = ring
                    closestCoords = coords
                }
            }
        }
    }

    return { ring: closestRing, x: closestCoords[0], z: closestCoords[1] }
}
