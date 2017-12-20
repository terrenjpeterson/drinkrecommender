/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

var Alexa = require('alexa-sdk');

var states = {
    STARTMODE: '_STARTMODE',                // Prompt the user to start or restart the game.
    ASKMODE: '_ASKMODE',                    // Alexa is asking user the questions.
    DESCRIPTIONMODE: '_DESCRIPTIONMODE'     // Alexa is describing the final choice and prompting to start again or quit
};


// Questions
var nodes = [{ "node": 1, "message": "Are you interested in a beverage with alcohol?", "yes": 2, "no": 3 },
             { "node": 2, "message": "Do you like cocktails and mixed drinks?", "yes": 4, "no": 5 },
             { "node": 3, "message": "Do you want a hot drink?", "yes": 101, "no": 102 },
             { "node": 4, "message": "Do you want a sweet tasting drink?", "yes": 6, "no": 7 },
             { "node": 5, "message": "Are you thirsty for a beer?", "yes": 8, "no": 9 },
             { "node": 6, "message": "Do you want a clear beverage?", "yes": 17, "no": 18 },
             { "node": 7, "message": "Would you rather have a sour drink than a dry tasting one?", "yes": 11, "no": 12 },
             { "node": 8, "message": "Do you like beers that have a bitter or hoppy flavor?", "yes": 107, "no": 108},
             { "node": 9, "message": "Do you want a drink with bubbles?", "yes": 109, "no": 10 },
             { "node": 10, "message": "Do you prefer red wine over white?", "yes": 110, "no": 111 },
             { "node": 11, "message": "Would you like some sweet flavor to mix with the sour?", "yes": 105, "no": 112 },
             { "node": 12, "message": "Do you prefer to taste the flavor of the alcohol, versus hidden?", "yes": 13, "no": 14 },
             { "node": 13, "message": "Do you prefer a clear drink?", "yes": 16, "no": 19 },
             { "node": 14, "message": "Do you like coffee flavored drinks?", "yes": 15, "no": 113 },
             { "node": 15, "message": "When you have coffee, do you like it black and omit any cream?", "yes": 115, "no": 116 },
             { "node": 16, "message": "Do you prefer ice and carbonation in your drink?", "yes": 117, "no": 106 },
             { "node": 17, "message": "Do you like the flavor of mint?", "yes": 103, "no": 118 },
             { "node": 18, "message": "Do you like coconuts?", "yes": 119, "no": 104 },
             { "node": 19, "message": "Are you looking for a strong tasting drink?", "yes": 114, "no": 120 },

// Answers & descriptions
             { "node": 101, "message": "Hot Chocolate", "yes": 0, "no": 0, "description": "Hot chocolate is a great treat to warm you up on a cold day. Don't forget to add the marshmallows on top!" },
             { "node": 102, "message": "Iced Tea", "yes": 0, "no": 0, "description": "Iced tea is a refreshing drink that can be enjoyed year round. To make, just take four to six tea bags, and add them to two cups of boiling water for five minutes. Depending on how diluted you want the tea, add water and then chill. Garnish with a slice of lemon and add ice." },
             { "node": 103, "message": "Mojito", "yes": 0, "no": 0, "description": "A mojito is a rum based drink, also containing sugar syrup, lime juice, and mint leaves. Be sure to use white rum to keep the color of the drink clear." },
             { "node": 104, "message": "Daiquiri", "yes": 0, "no": 0, "description": "A daiquiri is a rum based drink that can include your favorite fruit giving a colorful appearance. Use your favorite dark rum, and try a prepackaged mix, or make your own with blended fruit, simple syrup, and some lime juice." },
             { "node": 105, "message": "Amaretto Sour", "yes": 0, "no": 0, "description": "An Amaretto Sour is a drink containing the liqueur Amaretto, mixed with lime juice and a sweetener such as symple syrup. Use one part Amaretto to one part lime juice. To garnish, top with a maraschino cherry." },
             { "node": 106, "message": "Gin Martini", "yes": 0, "no": 0, "description": "A Gin Martini is a classic drink served chilled in a glass that bears its name. Garnish with a few olives, and potentially replace the Gin with Vodka. Along with the spirit, you will need dry vermouth and a dash of bitters." },
             { "node": 107, "message": "India Pale Ale", "yes": 0, "no": 0, "description": "IPA's are a hoppy beer style within the broader category of pale ale. They get their name from the East India Company traders in the late 18th century because of the brewery's location near the East India Docks. Varieties have differing levels of bitterness due to the hopping processes and content used in making the beer."},
             { "node": 108, "message": "Stout", "yes": 0, "no": 0, "description": "Stout is a dark beer made using roasted malt or roasted barley, hops, water and yeast. There are multiple varieties, including Milk Stout, Oatmeal Stout, and Irish Stout." },
             { "node": 109, "message": "Prosecco", "yes": 0, "no": 0, "description": "Prosecco is an Italian White wine similar to Champagne, with a intensely aromatic and crisp flavor. It is less expensive to produce, and does not need to be aged. Serve cold in a tall flute glass, and make a toast!" },
             { "node": 110, "message": "Cabernet Sauvignon", "yes": 0, "no": 0, "description": "Cabernet Sauvignon is a red wine, and available around the world. A glass of Cab goes well with many meals, including those where beef is served. It tends to be a full-bodied wine, with flavors likened to black cherry and black olives." },
             { "node": 111, "message": "Chardonnay", "yes": 0, "no": 0, "description": "Chardonnay is a white wine, and earns its name from the variety of grape it comes from. A glass of Chardonnay should be chilled, and is an excellent pairing for chicken or fish." },
             { "node": 112, "message": "Margarita", "yes": 0, "no": 0, "description": "A Margaria is a drink that can be served over ice, or frozen where the ice has been finely crushed. The glass can have salt added to the rim, and the drink contains tequila. The tanginess of the drink comes from lime juice and an orange liqueur, such as Cointreau or triple sec. Garnish with a slice of lime." },
             { "node": 113, "message": "Cosmopolitan", "yes": 0, "no": 0, "description": "A Cosmopolitan, or Cosmo, is a drink with a vodka base, and flavored with a fruit, including raspberry, cranberry, and pomegranate. Also included are an orange liqueur such as Cointreau, as well as lime juice. The contents are mixed with ice in a shaker, then strained into a martini glass. A garnish is optional, but can use a citrus peel." },
             { "node": 114, "message": "Manhattan", "yes": 0, "no": 0, "description": "A Manhattan is a clear, dark drink made with two parts rye whiskey to one part sweet vermouth, with a dash of bitters. The ingredients should be combined in a shaker filled with ice and then stirred. Serve by pouring the contents into a chilled cocktail glass, and garnish with a cherry." },
             { "node": 115, "message": "Black Russian", "yes": 0, "no": 0, "description": "A Black Russian is a drink combining two parts vodka to one part coffee flavored liqueur, such as Kahlua. Combine the ingredients in a mixing glass with ice and stir. Serve in an old fashion glass with new ice cubes, and no garnish." },
             { "node": 116, "message": "White Russian", "yes": 0, "no": 0, "description": "A White Russian is a drink combining equal parts of vodka, a coffee flavored liqueur, such as Kahlua, and heavy cream. Combine the ingredients in a mixing glass with ice and stir. Serve in an old fashion glass with new ice cubes, and no garnish." },
             { "node": 117, "message": "Gin and Tonic", "yes": 0, "no": 0, "description": "A Gin and Tonic is a drink made by combining gin and tonic water, usually one part gin to every two parts of tonic water. The ingredients can be combined in the serving glass filled with ice and stirred, garnished with a slice of lime. It's a popular drink with meals or on a warm summer day." },
             { "node": 118, "message": "Tom Collins", "yes": 0, "no": 0, "description": "A Tom Collins is a drink made with one part lemon juice, one part simple syrup, and two parts gin. The ingredients are mixed shaker filled with ice, then strained into a tall glass filled with ice. Top with club soda and garnish with a lemon wheel and a cherry." },
             { "node": 119, "message": "Pina Colada", "yes": 0, "no": 0, "description": "A Pina Cola is a tropical drink made with both white and dark rum, fresh diced pineapple, pineapple juice, and coconut cream. The ingredients are mixed in a blender with ice until smooth and frosty. Once complete, it is served in a glass garnished with more pineapple." },
             { "node": 120, "message": "Old Fashioned", "yes": 0, "no": 0, "description": "An Old Fashioned is a drink that starts with bourbon, then adds sugar and a splash of club soda. Garnish with a slice of orange and a maraschino cherry." }
];

// this is used for keep track of visted nodes when we test for loops in the tree
var visited;

// These are messages that Alexa says to the user during conversation

// This is the intial welcome message
var welcomeMessage = "Welcome to drink recommender. I will ask you multiple questions that you should answer yes or no. Based on your choices, I will identify a drink for you and provide some details on ingredients and how to make it - or where it can be purchased. Are you ready to begin?";

// This is the message that is repeated if the response to the initial welcome message is not heard
var repeatWelcomeMessage = "Say yes to start the drink recommendation generator, or no to quit.";

// this is the message that is repeated if Alexa does not hear/understand the reponse to the welcome message
var promptToStartMessage = "Say yes to continue, or no to end the activity.";

// This is the prompt during the game when Alexa doesnt hear or understand a yes / no reply
var promptToSayYesNo = "Say yes or no to answer the question.";

// This is the response to the user after the final question when Alex decides on what group choice the user should be given
var decisionMessage = "Based on exhaustive research, I recommend a";

// This is the prompt to ask the user if they would like to hear a short description of thier chosen profession or to play again
var playAgainMessage = "Say 'tell me more' to hear a short description about the drink, or do you want to try again?";

// this is the help message during the setup at the beginning of the game
var helpMessage = "I will ask you some questions that will identify the best drink for you would be based on a series of yes no questions. Want to start now?";

// This is the goodbye message when the user has asked to quit the game
var goodbyeMessage = "Ok, see you next time!";

var speechNotFoundMessage = "Could not find speech for node";

var nodeNotFoundMessage = "In nodes array could not find node";

var descriptionNotFoundMessage = "Could not find description for node";

var loopsDetectedMessage = "A repeated path was detected on the node tree, please fix before continuing";

var utteranceTellMeMore = "tell me more";

var utterancePlayAgain = "play again";

// the first node that we will use
var START_NODE = 1;

// --------------- Handlers -----------------------

// Called when the session starts.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandler, startGameHandlers, askQuestionHandlers, descriptionHandlers);
    alexa.execute();
};

// set state to start up and  welcome the user
var newSessionHandler = {
  'LaunchRequest': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
  },'AMAZON.HelpIntent': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', helpMessage, helpMessage);
  },
  'Unhandled': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', promptToStartMessage, promptToStartMessage);
  }
};

// --------------- Functions that control the skill's behavior -----------------------

// Called at the start of the game, picks and asks first question for the user
var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'AMAZON.YesIntent': function () {

        // ---------------------------------------------------------------
        // check to see if there are any loops in the node tree - this section can be removed in production code
        visited = [nodes.length];
        var loopFound = helper.debugFunction_walkNode(START_NODE);
        if( loopFound === true)
        {
            // comment out this line if you know that there are no loops in your decision tree
             this.emit(':tell', loopsDetectedMessage);
        }
        // ---------------------------------------------------------------

        // set state to asking questions
        this.handler.state = states.ASKMODE;

        // ask first question, the response will be handled in the askQuestionHandler
        var message = helper.getSpeechForNode(START_NODE);

        // record the node we are on
        this.attributes.currentNode = START_NODE;

        // ask the first question
        this.emit(':ask', message, message);
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
         this.emit(':ask', promptToStartMessage, promptToStartMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpMessage, helpMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToStartMessage, promptToStartMessage);
    }
});


// user will have been asked a question when this intent is called. We want to look at their yes/no
// response and then ask another question. If we have asked more than the requested number of questions Alexa will
// make a choice, inform the user and then ask if they want to play again
var askQuestionHandlers = Alexa.CreateStateHandler(states.ASKMODE, {

    'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        helper.yesOrNo(this,'yes');
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
         helper.yesOrNo(this, 'no');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    }
});

// user has heard the final choice and has been asked if they want to hear the description or to play again
var descriptionHandlers = Alexa.CreateStateHandler(states.DESCRIPTIONMODE, {

 'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'DescriptionIntent': function () {
        //var reply = this.event.request.intent.slots.Description.value;
        //console.log('HEARD: ' + reply);
        helper.giveDescription(this);
      },

    'Unhandled': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    }
});

// --------------- Helper Functions  -----------------------

var helper = {

    // gives the user more information on their final choice
    giveDescription: function (context) {

        // get the speech for the child node
        var description = helper.getDescriptionForNode(context.attributes.currentNode);
        var message = description + ', ' + repeatWelcomeMessage;

        context.emit(':ask', message, message);
    },

    // logic to provide the responses to the yes or no responses to the main questions
    yesOrNo: function (context, reply) {

        // this is a question node so we need to see if the user picked yes or no
        var nextNodeId = helper.getNextNode(context.attributes.currentNode, reply);

        // error in node data
        if (nextNodeId == -1)
        {
            context.handler.state = states.STARTMODE;

            // the current node was not found in the nodes array
            // this is due to the current node in the nodes array having a yes / no node id for a node that does not exist
            context.emit(':tell', nodeNotFoundMessage, nodeNotFoundMessage);
        }

        // get the speech for the child node
        var message = helper.getSpeechForNode(nextNodeId);

        // have we made a decision
        if (helper.isAnswerNode(nextNodeId) === true) {

            // set the game state to description mode
            context.handler.state = states.DESCRIPTIONMODE;

            // append the play again prompt to the decision and speak it
            message = decisionMessage + ' ' + message + ' ,' + playAgainMessage;
            console.log("Recommendation: " + message);
        }

        // set the current node to next node we want to go to
        context.attributes.currentNode = nextNodeId;

        context.emit(':ask', message, message);
    },

    // gets the description for the given node id
    getDescriptionForNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                return nodes[i].description;
            }
        }
        return descriptionNotFoundMessage + nodeId;
    },

    // returns the speech for the provided node id
    getSpeechForNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                return nodes[i].message;
            }
        }
        return speechNotFoundMessage + nodeId;
    },

    // checks to see if this node is an choice node or a decision node
    isAnswerNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                if (nodes[i].yes === 0 && nodes[i].no === 0) {
                    return true;
                }
            }
        }
        return false;
    },

    // gets the next node to traverse to based on the yes no response
    getNextNode: function (nodeId, yesNo) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                if (yesNo == "yes") {
                    return nodes[i].yes;
                }
                return nodes[i].no;
            }
        }
        // error condition, didnt find a matching node id. Cause will be a yes / no entry in the array but with no corrosponding array entry
        return -1;
    },

    // Recursively walks the node tree looking for nodes already visited
    // This method could be changed if you want to implement another type of checking mechanism
    // This should be run on debug builds only not production
    // returns false if node tree path does not contain any previously visited nodes, true if it finds one
    debugFunction_walkNode: function (nodeId) {

        // console.log("Walking node: " + nodeId);

        if( helper.isAnswerNode(nodeId) === true) {
            // found an answer node - this path to this node does not contain a previously visted node
            // so we will return without recursing further

            // console.log("Answer node found");
             return false;
        }

        // mark this question node as visited
        if( helper.debugFunction_AddToVisited(nodeId) === false)
        {
            console.log("duplicate: " + nodeId);
            // node was not added to the visited list as it already exists, this indicates a duplicate path in the tree
            return true;
        }

        // console.log("Recursing yes path");
        var yesNode = helper.getNextNode(nodeId, "yes");
        var duplicatePathHit = helper.debugFunction_walkNode(yesNode);

        if( duplicatePathHit === true){
            return true;
        }

        // console.log("Recursing no");
        var noNode = helper.getNextNode(nodeId, "no");
        duplicatePathHit = helper.debugFunction_walkNode(noNode);

        if( duplicatePathHit === true){
            return true;
        }

        // the paths below this node returned no duplicates
        return false;
    },

    // checks to see if this node has previously been visited
    // if it has it will be set to 1 in the array and we return false (exists)
    // if it hasnt we set it to 1 and return true (added)
    debugFunction_AddToVisited: function (nodeId) {

        if (visited[nodeId] === 1) {
            // node previously added - duplicate exists
            // console.log("Node was previously visited - duplicate detected");
            return false;
        }

        // was not found so add it as a visited node
        visited[nodeId] = 1;
        return true;
    }
};
