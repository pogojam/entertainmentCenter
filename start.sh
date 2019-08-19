#!/bin/bash

if [ $1 = "dev" ]
then    
    cd ./frontend && npm start &
    cd ./server && npm start
elfi    
fi