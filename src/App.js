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
  const [didILie, setDidILie] = useState('');

  const words = ['RED', 'BLACK',  'BLACK', 'RED', 'RED', 'BLACK',  'BLACK', 'RED', 'RED', 'BLACK'];

  const inverse = (c) => {
	  if (c === 'RED') {
		  return 'BLACK';
	  }
	  return 'RED';
  }
    const inverseAnswer = (c) => {
  	  if (c === 'yes') {
  		  return 'no';
  	  }
  	  return 'yes';
  }

  const startGame = () => {
    setStage(STAGE_GUEST_TRUTH_OR_LIE);
    setYesCount(0);
    setQuestionCount(0);
    setAnswers([]);
  };

    const handleTruthOrLieAnswer = (answer) => {
      setDidILie(answer);
  	setStage(STAGE_GUEST_CORRECT);
    };


    const handleAnswer = (answer) => {

      setAnswers((prevAnswers) => [...prevAnswers, didILie]);
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
            <button style={styles.button} onClick={startGame}>
              Start New Game
            </button>
          </div>
        )}

        {stage === STAGE_GUEST_TRUTH_OR_LIE && (
          <div style={styles.stageContainer}>
            <h1 style={styles.header}>How well can you tell a lie.</h1>

            <p style={styles.question}>
              Question {questionCount + 1}: Was it a lie?
            </p>
              <p />


            <button style={styles.button} onClick={() => handleTruthOrLieAnswer('yes')}>
              Yes
            </button>
            <button style={styles.button} onClick={() => handleTruthOrLieAnswer('no')}>
              No
            </button>
          </div>
        )}

                {stage === STAGE_GUEST_CORRECT && (
		          <div style={styles.stageContainer}>
		            <h1 style={styles.header}>How well can you tell a lie.</h1>

		            <p style={styles.question}>
		              Question {questionCount + 1}: Did you guess correctly ?
		            </p>
		              <p />


		            <button style={styles.button} onClick={() => handleAnswer('yes')}>
		              Guessed right :)
		            </button>
		            <button style={styles.button} onClick={() => handleAnswer('no')}>
		              Guessed wrong :(
		            </button>
		          </div>
        )}


        {stage === STAGE_GUEST_SUMMARY && (
          <div style={styles.stageContainer}>
            <h1 style={styles.header}>Summary</h1>
              <p style={styles.answerList}>You got {yesCount} correctly, {summaryText} !</p>

			<p />
            <button style={styles.button} onClick={startAsking}>
              Now it's my turn!
            </button>
          </div>
        )}

                {stage === STAGE_GPT_TRUTH_OR_LIE && (
		          <div style={styles.stageContainer}>
		            <h1 style={styles.header}>Now it's GPT turn to see if you lie!</h1>
		            <p style={styles.question}>
		              Question {questionCount + 1}: Is your card RED or BLACK ?
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
				            <h1 style={styles.header}>Now it's my turn to decide if you lie!</h1>
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
  answerList: {
    listStyleType: 'none',
    margin: '0',
    padding: '0',
  },
  answerItem: {
    fontSize: '16px',
    marginBottom: '5px',
  },
};


export default App;
