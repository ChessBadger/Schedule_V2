#!/bin/bash

# Change directory to the current script's directory
cd "$(dirname "$0")"

# Add all changes to the staging area
git add .

# Commit changes with a message (you might want to customize this message)
git commit -m "Automated commit $(date +'%Y-%m-%d %H:%M:%S')"

# Push changes to the 'main' branch of the 'origin' remote repository
git push origin main
