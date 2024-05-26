#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const ncp = require('ncp').ncp;

function createProject(projectName) {

    const projectPath = path.resolve(projectName);
    console.log(`Creating the project in ${projectPath}`);

    execSync(`npm init -y`, { cwd: projectPath, stdio: 'inherit' });
    execSync(`npm install @mrnjifanda/jifi-base`, { cwd: projectPath, stdio: 'inherit' });

    const folderPath = path.join(projectPath, 'node_modules', '@mrnjifanda');
    const templatePath = path.join(folderPath, 'jifi-base');
    ncp(templatePath, projectPath, (err) =>{

        if (err) return console.error(err);

        fs.rm(folderPath, { recursive: true, force: true }, (err) => {
            // if (err) return console.error(err);
            // console.log(`Folder ${folderPath} deleted successfully.`);
        });

        console.log(
            `Project ${projectName} created successfully.\n` +
            `Please run the following command to install the dependencies:\n` +
            `cd ${projectName}\n` +
            `npm install\n` +
            `cp .env.example .env\n` +
            `npm start\n`
        );
    });
}

const projectName = process.argv[2];
if (!projectName) {
    console.error('Please provide a name for your project.');
    process.exit(1);
}

const projectPath = path.resolve(projectName);
if (!fs.existsSync(projectPath)) {

    fs.mkdirSync(projectPath, { recursive: true });
    createProject(projectName);
} else {

    console.error(`The ${projectName} folder already exists.`);
}