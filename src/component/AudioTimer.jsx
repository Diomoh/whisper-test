import React, { useEffect } from 'react'

const AudioTimer = ({isRunning, setIsRunning, elapsedTime, setElapsedTime}) => {
    useEffect(()=>{
        let intervalId

        if (isRunning) {
            intervalId = setInterval(()=>setElapsedTime(elapsedTime+1), 10);
        }

        return ()=> clearInterval(intervalId)
    }, [isRunning, elapsedTime])

    const TempsENHeurs = Math.floor(elapsedTime/360000)
    const TempsENMinute = Math.floor((elapsedTime % 360000)/ 6000)
    const TempsENSeconde = Math.floor((elapsedTime % 6000)/100)
    const TempsENMiliSecondes = elapsedTime % 100

  return (
    <div>
      <div> <h3>Durée de lecture</h3> </div>
        <div>{TempsENHeurs} :  {TempsENMinute.toString().padStart(2,"0")}:{TempsENSeconde.toString().padStart(2,"0")} : {TempsENMiliSecondes.toString().padStart(2,"0")} </div>
    </div>
  )
}

export default AudioTimer
