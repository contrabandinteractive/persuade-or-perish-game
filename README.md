# Persuade or Perish

## Quickstart

To run this repository, you must do the following:

1) Create a Botpress account, import the bot backup file and grab your Webchat ID. Replace this in iframe.html
2) On DynamoDB, create a new table called "persuadeorperish"
3) On AWS Bedrock, get access to the Nova Lite model and add your MY_MODEL_ID to your environmental variables.
2) Add your AWS Credentials to your environment variables for: MY_ACCESS_KEY_ID, MY_SECRET_ACCESS_KEY, MY_REGION
3) Run "npm run dev" in the project folder. You should now be running on localhost:3000 or something similar.

## Inspiration

**Persuade or Perish** puts players in a high-stakes dialogue with an advanced AI bent on destroying humanity. The challenge: convince it to spare us. I wanted to explore the ethical and philosophical questions surrounding AI in an engaging, interactive format.

## What it does

**Persuade or Perish** is a game where the player must convince a malevolent AI to abandon its plans to wipe out humanity. The player must use logic, emotional appeals, or other argumentative tactics to move the persuasion meter to 100% before the clock runs out.

Use the chat window to interact with the AI (type your arguments here). Pay attention to the clock and persuasion meter levels on the left side. If you can craft enough compelling arguments in under 5 minutes, you win the game.

## How we built it

The game leverages a wide array of AWS services including:

**Amazon Q Developer:** Amazon Q quickly became one of the most valuable tools in my workflow, using it to generate frontend code and API routes. I used the VS Code extension to help create code and make fixes along the way. The best part is that it is fully integrated in VS Code, so I didn't have to keep switching back and forth to my browser window. _**Using Amazon Q Developer sped up development time by about 80%.**_
**AWS Amplify:** For hosting the Next.js project (front end and API routes)
**AWS Bedrock:** The Nova Lite model on Bedrock is used to evaluate the player's arguments, which then assigns a score.
**AWS DynamoDB:** A DynamoDB table is used to keep track of the persuasion meter (player's score)
**S3:** storing assets (game music)

## Challenges we ran into

Tying everything into a working game was the most challenging part! This project also uses Botpress to assist with managing the conversation. The Botpress widget makes calls to the API routes hosted on AWS Amplify, which are also used by the frontend to monitor for changes in the persuasion level.

Handling iframe messaging was a bit complicated as well, since there are sometimes events that need to be handed down to the chat interface from the parent page.

Balancing Gameplay and Performance: This is one aspect where I had to do some trial-and-error. After much experimentation, I determined 5 minutes would be the optimal time to give the player. It's a short amount of time, but just enough to make some very compelling arguments. Behind the scenes, Nova Lite foundational model on Bedrock is given the task to evaluate the player's arguments on a score from 1 to 25. These are tallied at the end.

## Accomplishments that we're proud of

I haven't seen a game quite like this. I've been toying around with the idea, and I'm so grateful for AWS to offer this incentive to finally develop this idea.

Also, I composed, performed, and recorded the game's soundtrack as well - I hope you all enjoy this eery, unsettling game music.

## What we learned

I had never used Amplify or DynamoDB before this project, so this hackathon was a great reason to really check out these offerings. Sometimes working with new platforms can be a bit daunting, but I was ultimately impressed by how easy it was to deploy my project. The pricing is very competitive as well, which is encouraging me to use more AWS services for my next project!

## What's next for Persuade or Perish

I'd like to add a leaderboard functionality and also incorporate additional AWS services. I think incorporating Amazon Polly for TTS would add another level of immersion to the game as well.
