# Drink Recommender Skill

Alexa skill using decision template making drink recommendations.

**Table of Contents**

- [Where do the questions come from?](#data-source-for-questions)
- [How do you deploy the skill?](#deploy-from-command-line)
- [How can you automate testing?](#testing-of-lambda-from-command-line)
- [How to customize for Echo Show?](#background-template-for-echo-show)

## Data Source for Questions

The data folder contains the questions referenced in the skill. These are modeled in json.

## Deploy from Command Line

To deploy the package, execute the build.sh script.
All of the necessary files are zipped up in a package, staged to S3, then deployed as a lambda function. Here are the commands to setup.

```sh
# create temp zip file with build package contents
echo 'zipping up files'
zip -r drinkbot.zip index.js package.json data/questions.json node_modules/ > temp.log
echo 'build file created'

# stage the temp file in s3
aws s3 cp drinkbot.zip s3://drinkrecommender/binaries/

# remove the temporary file
rm drinkbot.zip

# update the lambda function with the binaries that have been staged
aws lambda update-function-code --function-name drinkRecommendationGreen --s3-bucket drinkrecommender --s3-key binaries/drinkbot.zip
```

## Testing of Lambda from Command Line

Within the deployment script, there are CLI commands that read in a test object, then invoke the Lambda function directly.

```sh
# read in test data required to invoke the lambda function
echo 'test case 1 - basic request'
cd testing
request=$(<request.json)
cd ..

# invoke the new lambda function
aws lambda invoke --function-name drinkRecommendationGreen --payload "$request" testOutput.json

# read response file into local variable then print on the console
response=$(<testOutput.json)
echo $response
echo 'test case 1 complete'
```

## Background Template for Echo Show

To render a background image on the Echo show, there are a few additional pieces to incorporate into the skill.

* Stage a 1024x600 image in an S3 bucket.
* Check the device type invoking the skill as you can only render an image response for an Echo.
* Render a template for the image.

Here is the relevant code within the skill that accomplishes just this.

```sh
var newSessionHandler = {
  'LaunchRequest': function () {
    this.handler.state = states.STARTMODE;
    // Display.RenderTemplate directives can be added to the response
    const builder = new Alexa.templateBuilders.BodyTemplate1Builder();
    const imageLoc = 'https://s3.amazonaws.com/drinkrecommender/media/drinkBackground.png';
    const template = builder.setTitle('Your Personal Bartender')
							.setBackgroundImage(makeImage(imageLoc))
							.setTextContent(makePlainText('Drink Recommender'))
							.build();

    if (this.event.context.System.device.supportedInterfaces.Display) {
	//this.response.speak(welcomeMessage).listen(repeatWelcomeMessage).renderTemplate(template);
	this.response.speak(welcomeMessage).listen(repeatWelcomeMessage);
        this.emit(':responseReady');
	console.log("this was requested by an Echo Show");
    } else {
    	this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    }
  }
```
