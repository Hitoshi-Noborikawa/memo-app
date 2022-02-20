import React, { useState, useCallback, useEffect } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState("");
  const [registerText, setRegisterText] = useState("");
  const [start, setStart] = useState(false);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = new SpeechRecognition();
  // 認識の途中結果を表示
  recognition.interimResults = true;
  // 音声機能を1分間伸ばす
  recognition.continuous = true;
  recognition.lang = 'ja-JP';

  let finalTranscript = '';
  let punctuation = '';
  recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
              finalTranscript += transcript + punctuation;
          } else {
              interimTranscript = transcript + punctuation;
          }
          const newText = finalTranscript + interimTranscript;
          setText(newText);
          punctuation = '';
      }
  }

  const handleStart = () => {
      console.log('handleStart');
      recognition.start();
      setStart(true);
  }

  const handleStop = () => {
      console.log('handleStop');
      recognition.stop();
      setStart(false)
  }

  const handleRegister = () => {
      const newText = registerText + text;
      setRegisterText(newText)
      recognition.stop()
      recognition.start()
      setText("");
  }

  //句読点を入力
  const keyDownFunction = useCallback((event) => {
      console.log('keydown');
      console.log(event.key);
      if (event.key === ",") {
          punctuation += ',';
      } else if (event.key === ".") {
          punctuation += '。\n';
      }
  }, []);

  //これで発火するらしい。
  useEffect(() => {
      document.addEventListener('keydown', keyDownFunction, false);
  }, []);

  return (
    <div className="body">
        <div className="textarea-field">
            <textarea className="textarea" defaultValue={registerText}></textarea>
        </div>
        <div className="speech-area">
            <div className="button-area">
                <button className='btn btn-orange' onClick={start ? handleStop : handleStart }>{ start ? "Stop" : "Start" }</button>
                <button className='btn btn-orange' onClick={handleRegister}>OK</button>
            </div>
            <div className="text">{text}</div>
        </div>
    </div>
  );
}

export default App;
