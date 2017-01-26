import React from "react";
import ReactDOM from "react-dom";

var _ = require("lodash");

var data = [
	{
		name : 'Mark Twain',
		imageUrl :  'images/authors/MarkTwain.jpg',
		books : ['The Adventures of Huckleberry Finn']
	},
	{
		name : 'Joseph Conrad',
		imageUrl :  'images/authors/JosephConrad.PNG',
		books : ['Heart of Darkness']
	},
	{
		name : 'J.K. Rowling',
		imageUrl :  'images/authors/JKRowling.jpg',
		books : ['Harry Potter and the Sorcerers Stone']
	},
	{
		name : 'Stephen King',
		imageUrl :  'images/authors/StephenKing.jpg',
		books : ['The Shining', 'IT']
	},
	{
		name : 'Charles Dickens',
		imageUrl :  'images/authors/CharlesDickens.jpg',
		books : ['David Copperfield', 'A Tale of Two Cities']
	},
	{
		name : 'William Shakespeare',
		imageUrl :  'images/authors/WilliamShakespeare.jpg',
		books : ['Hamlet','Macbeth','Romeo and Juliet']
	}
];

var selectGame = function() {
	var books = _.shuffle(this.reduce(function(p, c, i) {
		return p.concat(c.books);
	}, [])).slice(0,4);

	var answer = books[_.random(books.length-1)];

	return {
		books : books,
		author : _.find(this, function(author) {
			return author.books.some(function(title) {
				return title === answer;
			});
		}),
		checkAnswer : function(title) {
			return this.author.books.some(function(t) {
				return t === title;
			});
		}

	};
};

data.selectGame = selectGame;

class Quiz extends React.Component {

	constructor(props) {
		super(props);
		this.state = _.extend({
			bgClass : 'neutral',
			showContinue : false
		}, this.props.data.selectGame());
	}

	static propTypes = {
		data : React.PropTypes.array.isRequired
	}

	handleBookSelected(title) {
		var isCorrect = this.state.checkAnswer(title);
		this.setState({
			bgClass : isCorrect ? 'pass' : 'fail',
			showContinue : isCorrect
		});
	}

	handleContinue() {
		this.setState(_.extend({
			bgClass : 'neutral',
			showContinue : false
		}, this.props.data.selectGame()))
	}

	handleAddGame() {
		routie('add');
	}

	render() {
		return (
			<div>
				<div className="row">
					<div className="col-md-4">
						<img src={this.state.author.imageUrl} className="authorimage col-md-12" />
					</div>
					<div className="col-md-6">
						{this.state.books.map(function(b) {
							return <Book onBookSelected={this.handleBookSelected.bind(this)} title={b} />;
						}.bind(this))}
					</div>
					<div className={"col-md-1 " + this.state.bgClass}></div>
				</div>
				{this.state.showContinue ? 
					(
						<div className="row">
							<div className="col-md-12">
								<button onClick={this.handleContinue.bind(this)} type="button" className="continue btn btn-primary btn-lg pull-right">Continue</button>
							</div>
						</div>
					) : <span/>
				}
				<div className="row">
					<div className="col-md-12">
						<button id="addGameButton" onClick={this.handleAddGame.bind(this)} type="button" className="btn btn-primary">Add Game</button>
					</div>
				</div>
			</div>
		);
	}
}

class Book extends React.Component {
	static propTypes = {
		title : React.PropTypes.string.isRequired
	}

	handleClick() {
		this.props.onBookSelected(this.props.title);
	}

	render() {
		return (
			<div onClick={this.handleClick.bind(this)} className="answer">
				<h4>{this.props.title}</h4>
			</div>
		);
	}
}

class AddGameForm extends React.Component {

	static propTypes = {
		onGameFormSubmitted : React.PropTypes.func.isRequired
	}

	handleSubmit() {
		var data = {
			imageUrl : this.refs.imageUrl.getDOMNode().value,
			answer1 : this.refs.answer1.getDOMNode().value,
			answer2 : this.refs.answer2.getDOMNode().value,
			answer3 : this.refs.answer3.getDOMNode().value,
			answer4 : this.refs.answer4.getDOMNode().value,
			solution :  this.refs.solution.getDOMNode().value,
		};
		this.props.onGameFormSubmitted(data);
		return false;
	}

	render() {
		return (
			<div className="row">
				<div className="col-md-12">
					<h1>Add Game</h1>
					<form role="form" onSubmit={this.handleSubmit.bind(this)}>
						<div className="form-group">
							<input ref="imageUrl" type="text" className="form-control" placeholder="Image Url" />
						</div>
						<div className="form-group">
							<input ref="answer1" type="text" className="form-control" placeholder="Answer 1" />
						</div>
						<div className="form-group">
							<input ref="answer2" type="text" className="form-control" placeholder="Answer 2" />
						</div>
						<div className="form-group">
							<input ref="answer3" type="text" className="form-control" placeholder="Answer 3" />
						</div>
						<div className="form-group">
							<input ref="answer4" type="text" className="form-control" placeholder="Answer 4" />
						</div>
						<div className="form-group">
							<input ref="solution" type="text" className="form-control" placeholder="Solution" />
						</div>
						<button type="submit" className="btn btn-default">Submit</button>
					</form>
				</div>
			</div>
		);
	}
}

var app = document.getElementById('app');

routie({
	'' : function() {
		ReactDOM.render(<Quiz data={data} />, app);
	},
	'add' : function() {
		ReactDOM.render(<AddGameForm onGameFormSubmitted={handleAddFormSubmitted.bind(this)} />, app);
	}
});

function handleAddFormSubmitted(addedData) {
	ReactDOM.render(<Quiz data={data} />, app);
};