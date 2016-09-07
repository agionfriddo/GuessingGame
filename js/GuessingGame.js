var generateWinningNumber = function() {
	return Math.ceil(Math.random() * 100);
};

var shuffle = function(array) {
  var m = array.length, t, i;

  while (m) {

    i = Math.floor(Math.random() * m--);

    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
};

var Game = function() {
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber(); 
};

Game.prototype.difference = function() {
	return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
	return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(guess) {
	if(guess > 100 || guess < 1 || isNaN(guess)) {
		$('#subtitle').text("Remember, I want a number between 1 and 100!")
		throw "That is an invalid guess."
	};
	this.playersGuess = guess;
	return this.checkGuess();
};

Game.prototype.checkGuess = function() {
	var guessCount 
	if(this.playersGuess === this.winningNumber) {
		$('#directions').text("Click reset to play again!");
		$('#submit, #hint').prop('disabled', true);
		return "You Win! The correct number was " + this.winningNumber + ".";
	}
	else if(this.pastGuesses.includes(this.playersGuess)) {
		$('#subtitle').text("You have already guessed that number.")
		return "You have already guessed that number.";
	}
	else {
		this.pastGuesses.push(this.playersGuess);
		$('#guess-list li:nth-child('+ this.pastGuesses.length+')').text(this.playersGuess);
		guessCount++
	}
	
	if(this.pastGuesses.length === 5) {
		$('#directions').text("Click reset to play again!");
		$('#submit, #hint').prop('disabled', true);
		return "You Lose. The correct number was " + this.winningNumber + "."
	}
	if(this.difference() < 10)
		return "You're burning up!"
	else if(this.difference() < 25)
		return "You're lukewarm."
	else if(this.difference() < 50)
		return "You're a bit chilly." 
	else if(this.difference() < 100)
		return "You're ice cold!"
};

var newGame = function() {
	return new Game();
};

Game.prototype.provideHint = function() {
	return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()])
}

$(document).ready(function() {
	var game = newGame();

	function makeAGuess(game) {
		var guess = $('#player-input').val();
		$('#player-input').val("");
		var output = game.playersGuessSubmission(parseInt(guess, 10));
		$('#subtitle').text(output);
	};

	$('#submit').click(function(e) {
		makeAGuess(game);
	});

	$('#player-input').keypress(function(event) {
		if(event.which == 13) {
			makeAGuess(game);
		}
	});

	$('#reset').click(function() {
		game = newGame();
		$('#subtitle').text('A Guessing Game of Epic Proportions')
		$('#directions').text('Guess a number between 1 and 100')
		$('#guess-list li').text('-');
		$('#hint, #submit').prop('disabled', false);
	});

	$('#hint').click(function() {
		var hints = game.provideHint();
		$('#subtitle').text("The winning number is " + hints[0] + ", " + hints[1] + ", or " + hints[2] + ".");
	});

});
