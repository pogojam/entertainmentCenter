#!/bin/bash

if [ $1 = "dev" ]
then    
    cd ./frontend && npm run dev &
    cd ./server && npm start
elfi    
fi