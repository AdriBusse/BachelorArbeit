import { useEffect, useState } from "react"

const useTimeMeassurment = () => {
    const [start, setStart] = useState<number>()
    const [finnish, setFinnish] = useState<number>()

    const startRequest = () => {
        setStart(Date.now())
    }
    const finnishRequest = () => {
        setFinnish(Date.now())
    }
    useEffect(() => {
        if (start && finnish) {
            console.log("Requesttime: ", finnish - start);
        }
    }, [finnish])
    return [startRequest, finnishRequest]
}

export default useTimeMeassurment