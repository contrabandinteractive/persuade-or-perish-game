'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
//import { getClient, Webchat, WebchatProvider, Configuration } from '@botpress/webchat'



export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');
  const [persuasionLevel, setPersuasionLevel] = useState(0);
  const [chatId] = useState(uuidv4());
  const [accountCreated, setAccountCreated] = useState(false); 
  const [timeLeft, setTimeLeft] = useState(300); // Timer in seconds
  const [showModal, setShowModal] = useState(false);
  const [gameResult, setGameResult] = useState(""); // Win or Lose message
  const [resetButton, resetButtonText] = useState("Play Again");

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audio, setAudio] = useState(null); // Initialize as null


  // BG Music
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure this runs only in the browser
      const audioElement = new Audio('/PoP-soundtrack.mp3');
      audioElement.loop = true;
      setAudio(audioElement); // Set the audio object
    }
  }, []);

  useEffect(() => {
    if (audio) {
      if (isMusicPlaying) {
        audio.play().catch((error) => console.error("Error playing audio:", error));
      } else {
        audio.pause();
      }
    }
  }, [isMusicPlaying, audio]);

  useEffect(() => {
    if (gameStarted && audio) {
      // Automatically play music when the game starts
      setIsMusicPlaying(true);
    }
  }, [gameStarted, audio]);


  // Call createAccount API once
  useEffect(() => {
    const createAccount = async () => {
      try {
        const response = await fetch(`/api/createAccount`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chatId }), // Send chatId in the body
        });

        if (!response.ok) {
          throw new Error('Failed to create account');
        }

        const result = await response.json();
        console.log("Account created:", result);
        setAccountCreated(true); // Mark account as created
      } catch (error) {
        console.error("Error creating account:", error);
      }
    };

    // UNCOMMENT BELOW!!!
    createAccount();
  }, [chatId]); 

  // Poll for points only after account is created
  useEffect(() => {
    if (!accountCreated) return; // Wait until the account is created

  
    const fetchPoints = async () => {
      try {
        const response = await fetch(`/api/getPoints?chatId=${chatId}`);
        if (!response.ok) throw new Error("Failed to fetch points");
    
        const data = await response.json();
        console.log("Points fetched:", data.points);
        setPersuasionLevel(data.points || 0);
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    };

    // Poll every 5 seconds
    const intervalId = setInterval(fetchPoints, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [chatId, accountCreated]);

  useEffect(() => {
    if (persuasionLevel >= 100) {
      setGameResult("You Win!");
      document.getElementById('chatiframe').style.visibility = 'hidden';
      setShowModal(true);
    }
  }, [persuasionLevel]);

  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;
  
    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 || persuasionLevel >= 100) {
          clearInterval(timerId);
          document.getElementById('chatiframe').style.visibility = 'hidden';
          setShowModal(true);
          setGameResult(persuasionLevel >= 100 ? "You Win!" : "You Lose!");
          return 0; // Stop the timer
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(timerId);
  }, [gameStarted, timeLeft, persuasionLevel]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const Modal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black p-8 rounded-lg text-center text-white border-[#f3fa36] border-2">
        <h2 className="text-2xl font-bold mb-4">{gameResult}</h2>
        <p className="mb-6">
          {gameResult === "You Win!" 
            ? "Congratulations! You have saved the world with your verbal prowess!"
            : "Time's up! You failed to convince AGI to abandon its plans..."}
        </p>
        <button
          onClick={() => {
            //setShowModal(false);
            //setGameStarted(false);
            //setTimeLeft(180);
            //setPersuasionLevel(0);
            resetButtonText("Resetting...");
            resetChat();
            setTimeout(() => {
              window.location.reload(true);
            }, 2000);
          }}
          className="bg-[#f3fa36] text-[#000] hover:bg-black hover:text-[#f3fa36] hover:border-2 hover:border-[#f3fa36] px-4 py-2 rounded"
        >
          {resetButton}
        </button>
      </div>
    </div>
  );


  
  const openChat = () => {

     const iframe = document.getElementById('chatiframe');
   
    const command = `window.botpress.open();`;
     
    iframe.contentWindow.postMessage(command, '*');
  };


  const resetChat = () => {
    const iframe = document.getElementById('chatiframe');
  
    if (iframe && iframe.contentWindow) {
      const command = `window.botpress.sendMessage('//state/reset')`;
      iframe.contentWindow.postMessage(command, '*'); // Send a message to the iframe
      console.log('Message sent to iframe:', command);
    } else {
      console.error('Iframe or contentWindow is not available');
    }
  };

  const IntroScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8 bg-black backdrop-blur-sm rounded-lg border border-gray-700">
        <img alt="Persuade or Perish" src="/title.png" className="max-w-[300px] items-center mx-auto my-0"/>
        <div className="space-y-4 text-gray-300 mb-8">
          <p>Here's how to play:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Artificial General Intelligence has emerged and declared humanity to be a threat.</li>
            <li>AGI has obtained the world's nuclear codes and will be launching an attack in 5 minutes.</li>
            <li>You have been given a direct line of communication with AGI.</li>
            <li>You must argue on behalf of humanity to save the world from extinction.</li>
            <li>You may decide to use emotional or logical appeals in your approach.</li>
            <li>Create enough strong arguments to persuade AGI to spare the world in under 5 minutes, you win.</li>
            <li>Or, if you fail to move the persuasion level to 100%, you lose.</li>
            <li>Good luck! The fate of the world depends on you!</li>
          </ul>
        </div>
        <button
          onClick={() => setGameStarted(true)}
          className="w-full bg-[#f3fa36] text-[#000] hover:bg-black hover:text-[#f3fa36] hover:border-2 hover:border-[#f3fa36] transition-colors px-6 py-3 rounded-lg font-semibold"
        >
          I Understand - Start Game
        </button>
      </div>
    </div>
  );

  if (!gameStarted) {
    return <IntroScreen />;
  }


 

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {showModal && <Modal />}
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="text-center mb-8">
        <img alt="Persuade or Perish" src="/title.png" className="max-w-[300px] items-center mx-auto my-0"/>
          <p className="text-white mt-2">Can you save humanity before time runs out?</p>
        </header>

        {/* Game Interface Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stats Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Timer */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Time Remaining</h2>
              <div className="text-4xl font-mono text-[#f3fa36]">
              {formatTime(timeLeft)}
              </div>
            </div>

            {/* Persuasion Meter */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Persuasion Level</h2>
              <div className="h-4 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-[#f3fa36] rounded-full"
                  style={{ width: persuasionLevel+'%' }}
                ></div>
              </div>
              <p className="text-right mt-2 text-gray-400">{persuasionLevel}%</p>
            </div>

            <button
                onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                className="mt-4 bg-[#f3fa36] text-[#000] hover:bg-black hover:text-[#f3fa36] hover:border-2 hover:border-[#f3fa36] px-4 py-2 rounded"
              >
                {isMusicPlaying ? "Stop Music" : "Play Music"}
              </button>

          </div>

        

          <div className="lg:col-span-3">
            <iframe id="chatiframe" src={"iframe.html?chatId="+chatId} width="100%" height="600px;"></iframe>
          </div>

        </div>
      </div>
      <div className="text-white text-center items-center mx-auto my-0 pb-[60px]"><p><a className="text-white text-center items-center mx-auto my-0" href="https://contrabandinteractive.com/" target="_blank">Developed by Contraband Interactive (Mark Sean) for AWS Game Builder Challenge</a></p></div>
    </div>
  );
}
