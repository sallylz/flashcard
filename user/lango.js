var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var port = 51837; // you need to put your port number here
var translated;
var review;
function Card(props) {
    return React.createElement(
        "div",
        { className: "textCard" },
        props.children
    );
}

function Txt(props) {
    if (props.phrase == undefined) {
        return React.createElement(
            "p",
            { id: "chinese" },
            "Text missing"
        );
    } else return React.createElement(
        "p",
        { id: "chinese" },
        props.phrase
    );
}

function Title(props) {
    return React.createElement(
        "div",
        { id: "Lango" },
        " ",
        React.createElement(
            "p",
            null,
            "Lango!"
        ),
        " "
    );
}

function Next(props) {
    return React.createElement(
        "div",
        { id: "next" },
        " ",
        React.createElement(
            "div",
            null,
            "Next"
        )
    );
}

function Save(props) {
    return React.createElement(
        "div",
        { id: "save" },
        " ",
        React.createElement(
            "div",
            { onClick: props.savecard },
            "Save"
        )
    );
}

function Footer(props) {
    return React.createElement(
        "div",
        { id: "footer" },
        " ",
        React.createElement(
            "p",
            { id: "username" },
            " ",
            props.username,
            "  "
        )
    );
}
function QCard(props) {
    return React.createElement(
        "div",
        { className: "card-container", id: "QCard" },
        props.children
    );
}
// React component for form inputs

var CardInput = function (_React$Component) {
    _inherits(CardInput, _React$Component);

    function CardInput() {
        _classCallCheck(this, CardInput);

        return _possibleConstructorReturn(this, (CardInput.__proto__ || Object.getPrototypeOf(CardInput)).apply(this, arguments));
    }

    _createClass(CardInput, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "fieldset",
                null,
                React.createElement("input", { id: this.props.id, onKeyPress: this.props.onKeyPress, placeholder: this.props.placeholder, required: true })
            );
        }
    }]);

    return CardInput;
}(React.Component);

var CardFront = function (_React$Component2) {
    _inherits(CardFront, _React$Component2);

    function CardFront() {
        _classCallCheck(this, CardFront);

        return _possibleConstructorReturn(this, (CardFront.__proto__ || Object.getPrototypeOf(CardFront)).apply(this, arguments));
    }

    _createClass(CardFront, [{
        key: "render",
        value: function render(props) {
            return React.createElement(
                "div",
                { className: "card-side side-front" },
                React.createElement(
                    "div",
                    { id: "logo1" },
                    React.createElement("img", { src: './arrow.svg' })
                ),
                React.createElement(
                    "div",
                    { className: "card-side-container" },
                    React.createElement(
                        "h2",
                        { id: "trans" },
                        this.props.text
                    )
                )
            );
        }
    }]);

    return CardFront;
}(React.Component);

// React component for the back side of the card


var CardBack = function (_React$Component3) {
    _inherits(CardBack, _React$Component3);

    function CardBack() {
        _classCallCheck(this, CardBack);

        return _possibleConstructorReturn(this, (CardBack.__proto__ || Object.getPrototypeOf(CardBack)).apply(this, arguments));
    }

    _createClass(CardBack, [{
        key: "render",
        value: function render(props) {
            return React.createElement(
                "div",
                { className: "card-side side-back" },
                React.createElement(
                    "div",
                    { id: "logo2" },
                    React.createElement("img", { src: './arrow.svg' })
                ),
                React.createElement(
                    "div",
                    { className: "card-side-container" },
                    React.createElement(
                        "h2",
                        { id: "congrats" },
                        this.props.text
                    )
                )
            );
        }
    }]);

    return CardBack;
}(React.Component);

function ACard(props) {
    return React.createElement(
        "div",
        { id: "ACard" },
        props.children
    );
}

var MainPage = function (_React$Component4) {
    _inherits(MainPage, _React$Component4);

    function MainPage(props) {
        _classCallCheck(this, MainPage);

        //call this so we can use this.props
        var _this4 = _possibleConstructorReturn(this, (MainPage.__proto__ || Object.getPrototypeOf(MainPage)).call(this, props));

        _this4.state = { opinion: "Translation", vocab: true, answer: "Hi", otherPage: "Start Review", question: "", username: "username", noCards: true, cardFront: true };
        _this4.togglePage = _this4.togglePage.bind(_this4);
        _this4.checkReturnAnswer = _this4.checkReturnAnswer.bind(_this4);
        _this4.checkReturnTranslation = _this4.checkReturnTranslation.bind(_this4);
        _this4.flipCard = _this4.flipCard.bind(_this4);
        _this4.nextWord = _this4.nextWord.bind(_this4);
        _this4.loadPage = _this4.loadPage.bind(_this4);
        _this4.savecard = _this4.savecard.bind(_this4);
        _this4.loadPage();

        return _this4;
    }

    _createClass(MainPage, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "all" },
                React.createElement(
                    "header",
                    null,
                    React.createElement(
                        "div",
                        { id: "Review", onClick: this.togglePage },
                        " ",
                        React.createElement(
                            "p",
                            { id: "review_txt" },
                            " ",
                            this.state.otherPage,
                            " "
                        )
                    ),
                    React.createElement(Title, null)
                ),
                this.state.vocab == false && React.createElement(
                    "div",
                    { id: "review" },
                    React.createElement(
                        "main",
                        { id: "mainReview" },
                        React.createElement(
                            QCard,
                            null,
                            React.createElement(
                                "div",
                                { className: "card-body", onClick: this.flipCard },
                                React.createElement(CardFront, { text: this.state.question }),
                                React.createElement(CardBack, { text: this.state.answer })
                            )
                        ),
                        React.createElement(
                            ACard,
                            null,
                            React.createElement(CardInput, { id: "inputAnswer", placeholder: "Answer", onKeyPress: this.checkReturnAnswer })
                        )
                    ),
                    React.createElement(
                        "div",
                        { id: "nextContainer", onClick: this.nextWord },
                        React.createElement(Next, null)
                    )
                ),
                this.state.vocab == true && React.createElement(
                    "div",
                    { id: "create" },
                    React.createElement(
                        "main",
                        { id: "mainCreate" },
                        React.createElement(
                            Card,
                            null,
                            React.createElement(CardInput, { id: "inputEng", placeholder: "English", onKeyPress: this.checkReturnTranslation })
                        ),
                        React.createElement(
                            Card,
                            null,
                            React.createElement(Txt, { phrase: this.state.opinion })
                        )
                    ),
                    React.createElement(
                        "div",
                        { id: "saveContainer" },
                        React.createElement(Save, { savecard: this.savecard })
                    )
                ),
                React.createElement(Footer, { username: this.state.username })
            );
        }
    }, {
        key: "flipCard",

        // end of render function 

        // onKeyPress function for the textarea element
        // When the charCode is 13, the user has hit the return key
        value: function flipCard(event) {
            var card = document.querySelector(".card-body");
            card.classList.toggle("is-flipped");
            this.setState({ cardFront: !this.state.cardFront });
        }
    }, {
        key: "togglePage",
        value: function togglePage(event) {
            console.log("vcabulary", this.state.vocab);

            if (this.state.noCards == false) {
                console.log("Toggle");
                if (this.state.otherPage == "Start Review") {
                    this.setState({ otherPage: "Add", vocab: !this.state.vocab, opnion: "Translation" });
                } else {
                    this.setState({ otherPage: "Start Review", vocab: !this.state.vocab, opinion: "Translation" });
                }
                //db.all( 'SELECT english FROM Flashcards', dataCallback);
                //function dataCallback(err, data) { console.log(data)}
                console.log("vcabulary", this.state.vocab);

                if (this.state.vocab == true) {
                    //send a request to get a word from the database
                    var url = "getWord";
                    var scope = this;
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", url, true);
                    xhr.onload = function () {
                        var responseStr = xhr.responseText; // get the JSON string 
                        var object = JSON.parse(responseStr);
                        console.log("grabWord!");
                        console.log(object.chinese);
                        var questionVocab = object.chinese;
                        scope.setState({ question: questionVocab, answer: object.english });
                    };
                    xhr.onerror = function () {
                        console.log("Error!");
                    };
                    console.log("before");
                    xhr.send();
                    console.log("after");
                }
            } else {
                alert("No Cards Yet!");
            }
        }
    }, {
        key: "nextWord",
        value: function nextWord(event) {
            var url = "getWord";
            var scope2 = this;
            var xhr = new XMLHttpRequest();
            document.getElementById("inputAnswer").value = "";
            var card = document.querySelector(".card-body");
            if (card != null && this.state.cardFront != true) {
                card.classList.toggle("is-flipped");
                this.setState({ cardFront: !this.state.cardFront });
                this.setState({});
                console.log("listner flipped");
            }
            xhr.open("GET", url, true);
            xhr.onload = function () {
                var responseStr = xhr.responseText; // get the JSON string 
                var object = JSON.parse(responseStr);
                console.log("nextWord!");
                console.log(object.chinese);
                var questionVocab = object.chinese;
                scope2.setState({ question: questionVocab, answer: object.english });
            };
            xhr.onerror = function () {
                console.log("Error!");
            };
            console.log("before");
            xhr.send();
            console.log("after");
            console.log(this.state.cardFront);
        }
    }, {
        key: "loadPage",
        value: function loadPage() {
            var url = "/user/loadPage";
            var scope = this;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onload = function () {
                var responseStr = xhr.responseText; // get the JSON string 
                var object = JSON.parse(responseStr);
                console.log("onload!");
                if (object.review == 0) {
                    console.log("vocab");
                    scope.setState({ vocab: true, otherPage: "Start Review", noCards: true });
                } else {
                    console.log("review");
                    scope.setState({ vocab: false, otherPage: "Add", noCards: false });
                    console.log(scope.state.vocab);
                }

                scope.setState({ username: object.username });
                console.log("vocab", scope.state.vocab);
                if (scope.state.vocab == false) {
                    scope.nextWord();
                }
            };
            xhr.onerror = function () {
                console.log("Error!");
            };
            xhr.send();
        }
    }, {
        key: "checkReturnTranslation",
        value: function checkReturnTranslation(event) {
            if (event.charCode == 13) {
                var newPhrase = document.getElementById("inputEng").value;
                //translate
                var url = "/user/translate?str=" + newPhrase;
                //
                var scope = this;
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.onload = function () {
                    var responseStr = xhr.responseText; // get the JSON string 
                    var object = JSON.parse(responseStr);
                    console.log("onload!");
                    console.log(object.Chinese);
                    translated = object.Chinese;
                    scope.setState({ opinion: object.Chinese });
                };
                xhr.onerror = function () {
                    console.log("Error!");
                };
                xhr.send();
            }
        }
    }, {
        key: "savecard",
        value: function savecard() {
            var english = document.getElementById("inputEng").value;
            var chinese = translated;
            console.log(chinese);
            var scope3 = this;
            var url = "save?str=" + english + "&Chinese=" + chinese;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onload = function () {
                console.log("Saved successfully");
                scope3.setState({ noCards: false });
            };
            xhr.onerror = function () {
                console.log("Error!");
            };
            xhr.send();
        }
    }, {
        key: "checkReturnAnswer",
        value: function checkReturnAnswer(event) {
            if (event.charCode == 13) {
                var answer = document.getElementById("inputAnswer").value;
                if (this.state.cardFront == true) {
                    var card = document.querySelector(".card-body");
                    card.classList.toggle("is-flipped");
                    this.setState({ cardFront: !this.state.cardFront });
                }
                console.log(this.state.answer);
                if (answer == this.state.answer) {
                    this.setState({ answer: "*** CORRECT! ^-^ *** " });
                }
            }
        }
    }]);

    return MainPage;
}(React.Component); // end of class


ReactDOM.render(React.createElement(MainPage, null), document.getElementById('root'));
/*
document.addEventListener("DOMNodeInserted", function() { 
    
    var card = document.querySelector(".card-body");
    if (card != null){
          card.addEventListener( 'click', function() {
          card.classList.toggle("is-flipped"); 
          this.setState({cardFront: !this.state.cardFront});
        }); 
        console.log("listner flipped");   
    }
});
*/
/*db commands that might be useful

db.get -> first
db.all -> all queries
DESC
*/