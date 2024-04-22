import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../assets/css/exerciseDetail.css';
import Header from './Header';
import gymVideo from '../assets/images/gym-video.mp4';
import ChatBox from './ChatBox';

const ExerciseDetail = () => {
    const [currentRound, setCurrentRound] = useState(1);
    const [timeLeft, setTimeLeft] = useState(20);
    const [isBreak, setIsBreak] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [exercise, setExercise] = useState(null);
    const [error, setError] = useState(null);
    const [timerRunning, setTimerRunning] = useState(false);
    const token = localStorage.getItem('Authorization');
    const [showTimer, setShowTimer] = useState(false);
    const roundDuration = 20;
    const breakDuration = 5;

    useEffect(() => {
        const selectedExerciseId = localStorage.getItem('selectedExerciseId');
        if (!selectedExerciseId) {
            setError('Exercise ID not found');
            setIsLoading(false);
            return;
        }

        axios.get(`http://localhost:8000/user/exercises/${selectedExerciseId}`, {
            headers: {
                'Authorization': token
            }
        })
        .then(response => {
            setExercise(response.data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('There was an error!', error);
            setError('Failed to load exercise');
            setIsLoading(false);
        });
    }, []);

    const startTimer = () => {
        handleStartTraining();
        setTimerRunning(true);
    };

    useEffect(() => {
        let timer;
        if (timerRunning) {
            timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime === 1) {
                        clearInterval(timer);
                        if (isBreak) {
                            setCurrentRound(prevRound => prevRound + 1);
                            setIsBreak(false);
                            setTimeLeft(roundDuration);
                        } else {
                            if (currentRound < 3) {
                                setIsBreak(true);
                                setTimeLeft(breakDuration);
                            } else {
                                handleCancel();
                            }
                        }
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [timerRunning, currentRound, isBreak]);

    const handleStartTraining = () => {
        setShowTimer(true);
    };

    const handleCancel = () => {
        setShowTimer(false);
        setCurrentRound(1);
        setIsBreak(false);
        setTimeLeft(roundDuration);
        setTimerRunning(false);
    };

    const CircleTimer = ({ radius, strokeWidth, progress }) => {
        const normalizedRadius = radius - strokeWidth * 2;
        const circumference = normalizedRadius * 2 * Math.PI;
        const strokeDashoffset = circumference - progress / 100 * circumference;
      
        return (
            <svg
                height={radius * 2}
                width={radius * 2}
                className="circle-timer"
            >
                <circle
                    stroke="#f00"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <text x={radius} y={radius} textAnchor="middle" dominantBaseline="middle" fill="#fff">
                    {Math.ceil(progress / 100 * (isBreak ? breakDuration : roundDuration))}
                </text>
            </svg>
        );
    };

    return (
        <div>
            {exercise ? (
                <div>
                    <Header />
                    <ChatBox />
                    <div className="main-banner" id="top">
                        <video autoPlay muted loop id="bg-video">
                            <source src={gymVideo} type="video/mp4" />
                        </video>
                        <div className="video-overlay header-text">
                            <div className="caption">
                                {!showTimer ? (
                                    <div className="choose-fit">
                                        <div id="svgContainer">
                                            <img src={`data:image/png;base64, ${exercise.image}`} alt="Exercise" />
                                        </div>
                                        <div className="fit-form">
                                            <h3>{exercise.name}</h3>
                                            <p><strong>Type:</strong> {exercise.type}</p>
                                            <p><strong>Description:</strong>{exercise.description}</p>
                                            <button className="btn btn-outline-danger" onClick={startTimer}>Start training</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="choose-fit">
                                        <div id="svgContainer">
                                            <img src={`data:image/png;base64, ${exercise.image}`} alt="Exercise" />
                                        </div>
                                        <div className="fit-form">
                                            {error && <div>Error: {error}</div>}
                                            {isLoading ? (
                                                <div>Loading...</div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <h3 style={{ marginRight: 'auto' }}>{isBreak ? `Break ${currentRound}` : `Round ${currentRound}`}</h3>
                                                    <CircleTimer
                                                        radius={50}
                                                        strokeWidth={10}
                                                        progress={(timeLeft / (isBreak ? breakDuration : roundDuration)) * 100}
                                                    />
                                                    <button className="btn btn-danger" style={{ marginLeft: 'auto', marginRight: '5%' }} onClick={handleCancel}>Cancel</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default ExerciseDetail;
