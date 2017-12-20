#!/bin/bash
# create build package and deploy a new skill

# create temp zip file with build package contents
zip -r drinkbot.zip index.js package.json data/questions.json node_modules/

# stage the temp file in s3
aws s3 cp drinkbot.zip s3://drinkrecommender/binaries/

# remove the temporary file
rm drinkbot.zip

# update the lambda function with the binaries that have been staged
aws lambda update-function-code --function-name drinkRecommendationGreen --s3-bucket drinkrecommender --s3-key binaries/drinkbot.zip
