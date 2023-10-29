import React, { useState, useEffect } from 'react'
import hotkeys from 'hotkeys-js'

const netherIdealBlindCoords = {
    'first ring': [
        [0, 220],
        [0, -220],
        [220, 0],
        [-220, 0],
        [220, 0],
        [-220, 0],
        [50, 210],
        [50, -210],
        [210, 50],
        [-210, 50],
        [210, -50],
        [-210, -50],
        [75, 200],
        [75, -200],
        [200, 75],
        [-200, 75],
        [200, -75],
        [-200, -75],
        [100, 190],
        [100, -190],
        [190, 100],
        [-190, 100],
        [190, -100],
        [-190, -100],
        [125, 172],
        [125, -172],
        [172, 125],
        [-172, 125],
        [172, -125],
        [-172, -125],
        [155, 155],
        [155, -155],
        [155, 155],
        [-155, 155],
        [155, -155],
        [-155, -155],
    ],
    'second ring': [
        [0, 620],
        [0, -620],
        [620, 0],
        [-620, 0],
        [620, 0],
        [-620, 0],
        [100, 610],
        [100, -610],
        [610, 100],
        [-610, 100],
        [610, -100],
        [-610, -100],
        [150, 600],
        [150, -600],
        [600, 150],
        [-600, 150],
        [600, -150],
        [-600, -150],
        [200, 585],
        [200, -585],
        [585, 200],
        [-585, 200],
        [585, -200],
        [-585, -200],
        [250, 565],
        [250, -565],
        [565, 250],
        [-565, 250],
        [565, -250],
        [-565, -250],
        [250, 565],
        [250, -565],
        [565, 250],
        [-565, 250],
        [565, -250],
        [-565, -250],
        [300, 540],
        [300, -540],
        [540, 300],
        [-540, 300],
        [540, -300],
        [-540, -300],
        [350, 510],
        [350, -510],
        [510, 350],
        [-510, 350],
        [510, -350],
        [-510, -350],
        [435, 435],
        [435, -435],
        [435, 435],
        [-435, 435],
        [435, -435],
        [-435, -435],
    ],
    'third ring': [
        [0, 1010],
        [0, -1010],
        [1010, 0],
        [-1010, 0],
        [1010, 0],
        [-1010, 0],
        [200, 990],
        [200, -990],
        [990, 200],
        [-990, 200],
        [990, -200],
        [-990, -200],
        [300, 965],
        [300, -965],
        [965, 200],
        [-965, 200],
        [965, -200],
        [-965, -200],
        [300, 965],
        [300, -965],
        [965, 300],
        [-965, 300],
        [965, -300],
        [-965, -300],
        [400, 930],
        [400, -930],
        [930, 400],
        [-930, 400],
        [930, -400],
        [-930, -400],
        [500, 880],
        [500, -880],
        [880, 500],
        [-880, 500],
        [880, -500],
        [-880, -500],
        [600, 815],
        [600, -815],
        [815, 600],
        [-815, 600],
        [815, -600],
        [-815, -600],
        [715, 715],
        [715, -715],
        [715, 715],
        [-715, 715],
        [715, -715],
        [-715, -715],
    ],
}


const Console = () => {
    const [output, setOutput] = useState([])

    const logToConsole = (text) => {
        const now = new Date()
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')
        const seconds = String(now.getSeconds()).padStart(2, '0')

        const appendedText = `[${hours}:${minutes}:${seconds}/INFO] ${text}`
        setOutput((prevOutput) => [...prevOutput, appendedText])
    }

    const handleHotkey = async () => {
        logToConsole('Finding closest ideal blind travel coordinates')
        try {
            const clipboardText = await navigator.clipboard.readText()
            const { x, z } = extractXZFromClipboard(clipboardText)
            if (!isNaN(x) && !isNaN(z)) {
                const result = findRingAndClosestCoords(
                    x,
                    z,
                    netherIdealBlindCoords,
                )
                logToConsole(
                    `Portal travel coordinates: [${result.ring}] x=${result.x}, z=${result.z}`,
                )
            } else {
                logToConsole('Clipboard text could not be parsed')
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const extractXZFromClipboard = (clipboardText) => {
        const match = clipboardText.match(
            /\/execute in minecraft:nether run tp @s (-?\d+(\.\d+)?,? \d+(\.\d+)? -?\d+(\.\d+)? \d+(\.\d+)?)/,
        )
        if (match) {
            const coordinates = match[1].split(' ')
            const x = parseFloat(coordinates[0])
            const z = parseFloat(coordinates[2])
            return { x, z }
        }
        return { x: NaN, z: NaN }
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

export default Console