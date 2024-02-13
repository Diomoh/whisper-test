import React, { useRef, useState} from 'react';
import {ReactMic} from 'react-mic';
import AudioTimer from './AudioTimer';
import axios from 'axios';
import { Card } from 'primereact/card';

import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';



const Recording = () => {

    const [voice, setVoice] = useState(false)

    const [isRunning, setIsRunning] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(0)
    const audioBlobRef = useRef(null);
    const [audioLink, setaudioLink] = useState(null)

    const [isDemandeTrascrire, setisDemandeTrascrire] = useState(false)
    const [isChargeTrans, setisChargeTrans] = useState(false)
    const [isErrorChange, setisErrorChange] = useState(false)

    const [isTranscription, setisTranscription] = useState(false)
    const [DataTranscription, setDataTranscription] = useState(null)



      const onStop = (blob)=>{
        setaudioLink(blob.blobURL)
        setIsRunning(false);
        audioBlobRef.current = blob.blob;
      }

      const StartHanle = ()=>{
        setVoice(true)
        setIsRunning(true)
      }
      const ReprendreHanle = ()=>{
        setVoice(true)
        setIsRunning(true)
        
      }
      const StopHanle = ()=>{
        setVoice(false)
        setIsRunning(false)
        setaudioLink(null)
      }


      const handleTranscription = async () => {
        setisDemandeTrascrire(true)
        setisChargeTrans(true)
        if (!audioBlobRef.current) {
            console.error('Aucun enregistrement audio trouvé.');
            return;
        }

        // Créer un objet FormData pour envoyer le fichier audio au backend
        const formData = new FormData();
        formData.append('audio', audioBlobRef.current, 'recording.mp3');

        console.log(formData)
        // Envoyer le fichier MP3 à votre API backend
        try {
           

            const response = await axios.post('http://192.168.1.198:7000/roy/audio_last', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status===200) {
                // Succès de la requête
                console.log(response)
                setDataTranscription(response.data.text)
                setisChargeTrans(false)
                setisTranscription(true)
                console.log('Transcription réussie.');
            } else {
                // Gérer les erreurs de la requête
                setisErrorChange(true)
                console.error('Erreur lors de la transcription.');
            }
        } catch (error) {
            // Gérer les erreurs de connexion
            console.error('Erreur réseau :', error);
        }
    };


    return (
        <div>
            <div>
                {audioLink ?  null : 
                <AudioTimer 
                isRunning = {isRunning}
                setIsRunning = {setIsRunning}
                elapsedTime = {elapsedTime}
                setElapsedTime = {setElapsedTime}
               
                
                />  }
            </div>
            <div>{ audioLink ? null : 
                <ReactMic 
                record = {voice}
                onStop={onStop}
                
                
                />
}
            </div>
            <div>

                {
                    audioLink ?  <audio controls src={audioLink} ></audio> : null
                }
           

            </div>
            <div>
                <div>
                {isRunning ? null : <button onClick={StartHanle} type="button">commencer</button>}

            </div>
            <div>
                {isRunning ? <button onClick={StartHanle} type="button">Continuer</button> : null}

            </div>
           
            <div>
                {isRunning ? <button onClick={StopHanle} type="button">stoper</button> : null}
                
            </div></div>

            <div>
                {isRunning ? <button onClick={ReprendreHanle} type="button">effacer</button> : null }
                
            </div>

            <div className="card flex justify-content-center">
            <Button label="Check" icon="pi pi-check" />
        </div>

            <div>
                <button type="submit" onClick={handleTranscription}>Transcrire</button>
            </div>

            {
                isDemandeTrascrire && (
                    <div className="card">
                        <Card title="Text transcrit">
                            
                            {
                                isChargeTrans && (
                                    <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />

                                )

                            }

                            {
                                isTranscription && (
                                    <p className="m-0">
                                { DataTranscription}
                            </p>
                                )
                            }
                            
                            {
                                isErrorChange && (
                                    <p className='text-red-500 font-bold'>
                                        une erreur s'est produite lors de la transcription de la note vocale. Vérifier votre connexion internet.
                                    </p>
                                )
                            }
                        </Card>
                    </div>
                )
            }
        </div>
    )
}

export default Recording
