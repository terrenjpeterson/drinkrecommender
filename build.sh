#!/bin/bash
# create build package and deploy a new skill

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
