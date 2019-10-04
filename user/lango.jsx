
const port = 51837; // you need to put your port number here
var translated;
var review;
function Card(props) {
    return <div className = "textCard" >{props.children}</div>;
}

function Txt(props) {
	 if (props.phrase == undefined) {
	    return <p id="chinese">Text missing</p>;
     }
	 else return <p id="chinese">{props.phrase}</p>;
}

function Title(props) {
    return <div id = "Lango"> <p>Lango!</p> </div>;
}

function Next(props){
    return <div id = "next"> <div >Next</div></div>;
}


function Save(props){
    return <div id = "save"> <div onClick = {props.savecard}>Save</div></div>;
}

function Footer(props){
    return <div id = "footer" > <p id = "username"> {props.username}  </p></div>;
}
function QCard(props) {
    return <div className = 'card-container' id="QCard" >
    	   {props.children}
	</div>;
}
// React component for form inputs
class CardInput extends React.Component {
  render() {
    return(
      <fieldset>
        <input  id={this.props.id} onKeyPress = {this.props.onKeyPress} placeholder={this.props.placeholder} required/>
      </fieldset>
    )
  }
}
class CardFront extends React.Component {
  render(props) {
    return(
      <div className='card-side side-front'>
        <div id = "logo1">
            <img src = {'./arrow.svg'}/>
         </div>
         <div className='card-side-container'>
              <h2 id='trans'>{this.props.text}</h2>
        </div>
      </div>
    )
  }
}

// React component for the back side of the card
class CardBack extends React.Component {
  render(props) {
    return(
      <div className='card-side side-back'>
        <div id = "logo2">
            <img src = {'./arrow.svg'}/>
         </div>
         <div className='card-side-container'>
              <h2 id='congrats'>{this.props.text}</h2>
        </div>
      </div>
    )
  }
}

function ACard(props) {
    return <div id="ACard">
    	   {props.children}
	</div>;
}

class MainPage extends React.Component {

  constructor(props) {
          super(props); //call this so we can use this.props
          this.state = { opinion: "Translation" ,vocab: true,answer: "Hi",otherPage: "Start Review",question: "",username: "username",noCards: true,cardFront: true};
          this.togglePage = this.togglePage.bind(this);
          this.checkReturnAnswer = this.checkReturnAnswer.bind(this);
          this.checkReturnTranslation = this.checkReturnTranslation.bind(this);
          this.flipCard = this.flipCard.bind(this);
          this.nextWord = this.nextWord.bind(this);
          this.loadPage = this.loadPage.bind(this);
          this.savecard = this.savecard.bind(this);
          this.loadPage();

    
  }

  render() {return (
      <div id = "all">
          <header>
              <div id = "Review" onClick = {this.togglePage}> <p id="review_txt"> {this.state.otherPage} </p></div>
              <Title> 
              </Title>
          </header>
          {this.state.vocab == false &&
            <div id = "review">
                  <main id = "mainReview"> 
                     <QCard >
                          <div className='card-body' onClick = {this.flipCard}>
                             <CardFront text = {this.state.question} />
                              <CardBack text = {this.state.answer}/>
                          </div>
                      </QCard>
                      <ACard>
                          <CardInput id="inputAnswer" placeholder= "Answer" onKeyPress = {this.checkReturnAnswer} />
                      </ACard>
                  </main>
                  <div id = "nextContainer" onClick = {this.nextWord}>
                  <Next></Next> 
                  </div>
              </div>
          }
          {this.state.vocab == true &&
              <div id = "create">
              <main id = "mainCreate">
                  <Card>
                      <CardInput id="inputEng" placeholder= "English" onKeyPress={this.checkReturnTranslation} />
                  </Card>
                  <Card>
                      <Txt phrase={this.state.opinion} /> 
                  </Card>
              </main>
              <div id = "saveContainer">
              <Save savecard = {this.savecard}></Save> 
              </div>
              </div>
          }
          <Footer username = {this.state.username} ></Footer>
      </div>
      );
    };
                  // end of render function 

    // onKeyPress function for the textarea element
    // When the charCode is 13, the user has hit the return key
    flipCard(event){
        var card = document.querySelector(".card-body");
        card.classList.toggle("is-flipped"); 
        this.setState({cardFront: !this.state.cardFront});
    }
    
    togglePage(event){
        console.log("vcabulary", this.state.vocab);
            
        if (this.state.noCards == false){
             console.log("Toggle");
             if(this.state.otherPage == "Start Review"){
                this.setState({otherPage : "Add", vocab: !this.state.vocab, opnion: "Translation"});
             }
             else{
                this.setState({otherPage : "Start Review", vocab: !this.state.vocab, opinion: "Translation"});
             }
             //db.all( 'SELECT english FROM Flashcards', dataCallback);
                    //function dataCallback(err, data) { console.log(data)}
            console.log("vcabulary", this.state.vocab);
            
            if (this.state.vocab == true){
                //send a request to get a word from the database
                let url = "getWord" ; 
                const scope = this;
                let xhr = new XMLHttpRequest();  
                xhr.open("GET", url, true);  
                xhr.onload = function (){
                    let responseStr = xhr.responseText;  // get the JSON string 
                    let object = JSON.parse(responseStr);
                    console.log("grabWord!");
                    console.log(object.chinese);
                    let questionVocab = object.chinese;
                    scope.setState({ question: questionVocab, answer: object.english });
                };  
                xhr.onerror = function(){
                    console.log("Error!");
                };
                console.log("before");
                xhr.send(); 
                console.log("after");
            }
        }
        else{
            alert("No Cards Yet!")
        }
        
    }
    nextWord(event){
        let url = "getWord" ; 
            const scope2 = this;
            let xhr = new XMLHttpRequest();  
            document.getElementById("inputAnswer").value = "";
            var card = document.querySelector(".card-body");
            if (card != null && this.state.cardFront != true){       
                    card.classList.toggle("is-flipped"); 
                    this.setState({cardFront: !this.state.cardFront});
                    this.setState({});
                    console.log("listner flipped");   
            }
            xhr.open("GET", url, true);  
            xhr.onload = function (){
                let responseStr = xhr.responseText;  // get the JSON string 
                let object = JSON.parse(responseStr);
                console.log("nextWord!");
                console.log(object.chinese);
                let questionVocab = object.chinese;
                scope2.setState({ question: questionVocab, answer: object.english });
            };  
            xhr.onerror = function(){
                console.log("Error!");
            };
            console.log("before");
            xhr.send(); 
            console.log("after");
            console.log(this.state.cardFront);
    }
    loadPage(){
            let url = "/user/loadPage"; 
            const scope = this;
            let xhr= new XMLHttpRequest();  
            xhr.open("GET", url, true);  
            xhr.onload = function(){
                let responseStr = xhr.responseText;  // get the JSON string 
                let object = JSON.parse(responseStr);
                console.log("onload!");
                if (object.review == 0){
                    console.log("vocab");
                    scope.setState({vocab: true,otherPage: "Start Review",noCards: true });
                }
                else{
                    console.log("review");
                    scope.setState({vocab: false, otherPage: "Add",noCards : false });
                    console.log(scope.state.vocab);
                }
                
                scope.setState({username: object.username } );
                  console.log("vocab",scope.state.vocab);
                  if(scope.state.vocab == false){
                     scope.nextWord();
                  }
            };  
            xhr.onerror = function(){
                console.log("Error!");
            };
            xhr.send(); 
    }
    
    checkReturnTranslation(event) {
        if (event.charCode == 13) {
            let newPhrase = document.getElementById("inputEng").value;
            //translate
            let url = "/user/translate?str=" + newPhrase; 
            //
            const scope = this;
            let xhr= new XMLHttpRequest();  
            xhr.open("GET", url, true);  
            xhr.onload = function(){
                let responseStr = xhr.responseText;  // get the JSON string 
                let object = JSON.parse(responseStr);
                console.log("onload!");
                console.log(object.Chinese);
                translated = object.Chinese;
                scope.setState({opinion: object.Chinese } );
            };  
            xhr.onerror = function(){
                console.log("Error!");
            };
            xhr.send(); 

    
	    }
	 }
    savecard() {
        let english = document.getElementById("inputEng").value;
        let chinese = translated;
            console.log(chinese);
        let scope3 = this;
        let url = "save?str=" + english + "&Chinese=" + chinese;
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function(){
            console.log("Saved successfully");
            scope3.setState({ noCards: false})
        }
        xhr.onerror = function(){
            console.log("Error!");
        };
            xhr.send();
    }

    checkReturnAnswer(event){
        if (event.charCode == 13) {
            let answer = document.getElementById("inputAnswer").value;
            if (this.state.cardFront == true){
                var card = document.querySelector(".card-body");
                card.classList.toggle("is-flipped");
                this.setState({cardFront: !this.state.cardFront});
            }
            console.log(this.state.answer);
            if ( answer == this.state.answer){
                this.setState({answer : "*** CORRECT! ^-^ *** "});
            }
        }
        
    }
    
  } // end of class


ReactDOM.render(
    <MainPage />,
    document.getElementById('root')
);
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
