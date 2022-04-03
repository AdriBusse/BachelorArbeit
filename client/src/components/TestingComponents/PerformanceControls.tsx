import React from 'react'

const PerformanceControls = () => {
    const startMarker = () => {
        const marker = performance.mark('start')
        console.log(marker);

    }
    const stopMarker = () => {
        // performance.mark('start')
        console.log(performance);


    }
    const printMarker = () => {
        var marks = performance.getEntriesByType('measure')
        console.log(JSON.stringify(marks));

        console.info(`Time took to say hello ${marks[1].startTime - marks[0].startTime}`)
    }
    const clearMarker = () => {
        performance.clearMarks()
        performance.clearMeasures()
    }
    return (
        <div className="flex flex-col p-1">
            <h1 className="text-center">Performance Controlls:</h1>
            <div className="flex flex-row justify-center p-1 ">
                <button className="py-1 mr-2 leading-4 md:block lg:w-32 blue button" onClick={() => startMarker()}>Start Marker</button>
                <button className="py-1 mr-2 leading-4 md:block lg:w-32 blue button" onClick={() => stopMarker()}>Stop Marker</button>
                <button className="py-1 mr-2 leading-4 md:block lg:w-32 blue button" onClick={() => printMarker()}>Print Marker</button>
                <button className="py-1 mr-2 leading-4 md:block lg:w-32 blue button" onClick={() => clearMarker()}>Clear Marker</button>
            </div>
        </div>
    )
}

export default PerformanceControls