import React, { useState } from 'react';

const App = () => {
  const STAGE_START = 0;
  const STAGE_GUEST_TRUTH_OR_LIE = 1;
  const STAGE_GUEST_CORRECT = 2;
  const STAGE_GUEST_SUMMARY = 3;
  const STAGE_GPT_TRUTH_OR_LIE = 4;
  const STAGE_GPT_CORRECT = 5;
  const STAGE_GPT_SUMMARY = 6;
  const STAGE_GPT_SUMMARY_GAME_OVER = 7;



  const [stage, setStage] = useState(STAGE_START);
  const [questionCount, setQuestionCount] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [yesCount, setYesCount] = useState(0);
  const [summaryText,setSummaryText] = useState('');
  const [currentGPTGuess, setCurrentGPTGuess] = useState('');
  const [currentGPTGuessColor, setCurrentGPTGuessColor] = useState('');
  const [chatGPTAnswer, setChatGPTAnswer] = useState('');
  const [nameHost, setNameHost] = useState('');
  const [nameGuest, setNameGuest] = useState('');
  const [lastAnswer,setLastAnswer] = useState('');


  const words = ['RED', 'BLACK',  'BLACK', 'RED', 'RED', 'BLACK',  'BLACK', 'RED', 'RED', 'BLACK'];

  const inverse = (c) => {
	  if (c === 'RED') {
		  return 'BLACK';
	  }
	  return 'RED';
  }


  const startGame = () => {
    setStage(STAGE_GUEST_TRUTH_OR_LIE);
    setYesCount(0);
    setQuestionCount(0);
    setAnswers([]);
  };

    const handleNameChangeHost = (e) => {
      setNameHost(e.target.value);
  };
    const handleNameChangeGuest = (e) => {
      setNameGuest(e.target.value);
  };

  const lastLieStatus = () => {
	  return ( answers[answers.length - 1] === 'yes' ?
	  	`caught ${nameHost} lying ?` :
	  	`confirmed that ${nameHost} told the truth ?`
	  	)
  }
    const handleTruthOrLieAnswer = (answer) => {
      setAnswers((prevAnswers) => [...prevAnswers, answer]);
      setLastAnswer('');
  	  setStage(STAGE_GUEST_CORRECT);
    };


    const handleAnswer = (answer) => {

	  setLastAnswer(answer);

      setQuestionCount((prevCount) => prevCount + 1);

          if (answer === 'yes') {
  	      setYesCount((prevCount) => prevCount + 1);
  	    }


      if (questionCount + 1 === 10) {
  	  setSummaryText(yesCount > 5 ? 'Not bad' : ( yesCount > 4 ? 'Rather average' : 'Terrible'))
        setStage(STAGE_GUEST_SUMMARY);
      } else {
  	  setStage(STAGE_GUEST_TRUTH_OR_LIE);
  	}
  };

   const handleReenterAnswers = () => {

	      		setAnswers((prevAnswers) => {
	   			const pr = [...prevAnswers]
	   			pr.pop();
	   			return pr;
			});

	 if (stage === STAGE_GUEST_TRUTH_OR_LIE) {
	   if (questionCount > 0) {
	   	setQuestionCount((prevCount) => prevCount - 1);
   		if (lastAnswer === 'yes') {
			setYesCount((prevCount) => prevCount - 1);
		}

		}
	} else {
	}

	   setLastAnswer('');
	   setStage(STAGE_GUEST_TRUTH_OR_LIE);


   }

  const handleGPTAnswer = (answer) => {
	  const calculatedCurrentGPTGuess = answers[questionCount] === 'yes' ?
	  	words[questionCount] :
	  	inverse(words[questionCount]);

	  	setCurrentGPTGuess(calculatedCurrentGPTGuess);
	  	setCurrentGPTGuessColor(calculatedCurrentGPTGuess.toLowerCase());

	  	  if (answer === calculatedCurrentGPTGuess) {

			  setChatGPTAnswer('You are telling the truth!');
		  } else {
			  setChatGPTAnswer('You lie!');

		  }


	  setQuestionCount((prevCount) => prevCount + 1);





	  if (questionCount + 1 === 10) {
		  setStage(STAGE_GPT_SUMMARY);
	  } else {
		  setStage(STAGE_GPT_CORRECT);
	  }
  }

  const keepAsking = () => {
	  setStage(STAGE_GPT_TRUTH_OR_LIE);
  }

  const stopAsking = () => {
	  setStage(STAGE_GPT_SUMMARY_GAME_OVER);
  }






    const startAsking = () => {
	  setQuestionCount(0);
      setStage(STAGE_GPT_TRUTH_OR_LIE);

  };

    return (
      <div style={styles.container}>
        {stage === STAGE_START && (
          <div style={styles.stageContainer}>
            {questionCount ? (<h1 style={styles.header}>Game Over</h1>) : ( <p/> ) }
                     <div  style={styles.inputContainer}>
			            <input style={styles.inputBox} type="text" id="name" placeholder="Who is lying?" value={nameHost} onChange={handleNameChangeHost} />
          			</div>

          			            <div style={styles.inputContainer}>
								            <input style={styles.inputBox}  placeholder="Who will be guessing?"  type="text" id="name" value={nameGuest} onChange={handleNameChangeGuest} />
          			</div>
            <button style={styles.button} onClick={startGame}>
              Start New Game
            </button>
          </div>
        )}

        {stage === STAGE_GUEST_TRUTH_OR_LIE && (
          <div style={styles.stageContainer}>
            <h1 style={styles.header}>How well can {nameGuest} spot a lie.</h1>

            <p style={styles.question}>
              Question {questionCount + 1}: Did {nameHost} tell the truth?
            </p>
              <p />


            <button style={styles.button} onClick={() => handleTruthOrLieAnswer('no')}>
              Truth
            </button>
            <button style={styles.button} onClick={() => handleTruthOrLieAnswer('yes')}>
              Lie
            </button>
                     <button style={styles.buttonBack} onClick={() => handleReenterAnswers()}>
								  Back
            		</button>
          </div>
        )}

                {stage === STAGE_GUEST_CORRECT && (
		          <div style={styles.stageContainer}>
		            <h1 style={styles.header}>How well can {nameGuest} spot a lie.</h1>

		            <p style={styles.question}>
		              Question {questionCount + 1}: Did {nameGuest} {lastLieStatus()}
		            </p>
		              <p />


		            <button style={styles.button} onClick={() => handleAnswer('yes')}>
		              Yes
		            </button>
		            <button style={styles.button} onClick={() => handleAnswer('no')}>
		              No
		            </button>
		                        <button style={styles.buttonBack} onClick={() => handleReenterAnswers()}>
								  Back
            		</button>
		          </div>
        )}


        {stage === STAGE_GUEST_SUMMARY && (
          <div style={styles.stageContainer}>
            <h1 style={styles.header}>Summary</h1>
              <p style={styles.answerList}>{nameHost} got {yesCount} correctly, {summaryText} !</p>

			<p />
            <button style={styles.button} onClick={startAsking}>
              Now it's GPT turn!
            </button>
          </div>
        )}

                {stage === STAGE_GPT_TRUTH_OR_LIE && (
		          <div style={styles.stageContainer}>
		            <h1 style={styles.header}>Now it's GPT turn to see if {nameHost} lie!</h1>
		            <p style={styles.question}>
		              Question {questionCount + 1}: {nameHost}, is your card RED or BLACK ?
		            </p>
		            <button     style={{
		                ...styles.colorBox,
		                backgroundColor: 'red',
		              }} onClick={() => handleGPTAnswer('RED')}>

		            </button>
		                    <button     style={{
						                ...styles.colorBox,
						                backgroundColor: 'black',
						              }} onClick={() => handleGPTAnswer('BLACK')}>

		            </button>
		          </div>
        )}

                        {(stage === STAGE_GPT_CORRECT || stage === STAGE_GPT_SUMMARY) && (
				          <div style={styles.stageContainer}>
				            <h1 style={styles.header}>Now it's GPT turn to decide if {nameHost} lie!</h1>
				              <p style={styles.answerList}>{chatGPTAnswer} It was {currentGPTGuess}</p>
		            <div
				              style={{
				                ...styles.colorBox,
				                backgroundColor: currentGPTGuessColor,
				              }}
								></div>
								<p/>
				 </div>

        )}

        {(stage === STAGE_GPT_CORRECT)  && (
			<div>
				            <button style={styles.button} onClick={keepAsking}>
							              Continue!
							            </button>

							            </div>
			)}

			        {(stage === STAGE_GPT_SUMMARY)  && (
					<div>
							            <button style={styles.button} onClick={stopAsking}>
										              Let's see how GPT did...
										            </button>

							            </div>

			)}


                {stage === STAGE_GPT_SUMMARY_GAME_OVER && (
		          <div style={styles.stageContainer}>
		            <h1 style={styles.header}>Summary:</h1>
		              <p style={styles.answerList}>GPT got all 10 correctly... no more lying for humans !</p>
		               <p/>


		            <button style={styles.button} onClick={startGame}>
		              Try again!
		            </button>
		          </div>
        )}

        {false && (
			 <div>{JSON.stringify(answers)}</div>
			 )}
      </div>
    );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8f8f8',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  stageContainer: {
    marginBottom: '20px',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  question: {
    fontSize: '18px',
    marginBottom: '10px',

      fontFamily: 'Helvetica'
  },
  colorBox: {
    width: '200px',
    height: '200px',
    margin: '10px 0',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    marginRight: '10px',
  },
    buttonBack: {
      padding: '10px 20px',
      fontSize: '16px',
      fontWeight: 'bold',
      backgroundColor: '#b3b3cc',
      color: '#fff',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      marginRight: '10px',
  },
  answerList: {
    listStyleType: 'none',
    margin: '0',
    padding: '0',
  },
  answerItem: {
    fontSize: '16px',
    marginBottom: '5px',
  },
 inputBox: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "8px",
    fontSize: "14px",
    borderColor:"#8e8ea0",
    colorScheme:"light",
    fontFamily:"Söhne, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, Helvetica Neue, Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",

  },
  inputContainer: {
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "8px",
    borderRadius: "4px",
    marginBottom: "16px",
	}
};


export default App;
