#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const ncp = require('ncp').ncp;
const chalk = require('chalk');

function runCommand(command, options = {}) {

    try {

        execSync(command, { stdio: 'inherit', ...options });
    } catch (error) {

        console.error(chalk.red(`Error executing command: ${command}`), error);
        process.exit(1);
    }
}

function createProject(projectName) {

    const projectPath = path.resolve(projectName);
    console.log(chalk.blue(`Creating the project in ${projectPath}`));
    try {

        runCommand('npm init -y', { cwd: projectPath });
        runCommand('npm install @mrnjifanda/jifi-base', { cwd: projectPath });
        const templatePath = path.join(projectPath, 'node_modules', '@mrnjifanda', 'jifi-base');
        ncp(templatePath, projectPath, (err) => {

            if (err) {

                console.error(chalk.red('Error copying template files:'), err);
                process.exit(1);
            }

            fs.rm(templatePath, { recursive: true, force: true }, (err) => {

                if (err) {

                    console.error(chalk.red('Error deleting template files:'), err);
                }
            });

            console.log(chalk.green(`\nProject ${projectName} created successfully.\n\n`) +
                chalk.cyan('Please run the following commands to get started:\n') +
                chalk.yellow(`  cd ${projectName}\n`) +
                chalk.yellow('  npm install\n') +
                chalk.yellow('  cp .env.example .env\n') +
                chalk.yellow('  npm start\n')
            );
        });
    } catch (error) {

        console.error(chalk.red('Error creating project:'), error);
        process.exit(1);
    }
}

function main() {

    const projectName = process.argv[2];
    if (!projectName) {

        console.error(chalk.red('Please provide a name for your project.'));
        process.exit(1);
    }

    const projectPath = path.resolve(projectName);

    if (fs.existsSync(projectPath)) {

        console.error(chalk.red(`The folder "${projectName}" already exists.`));
        process.exit(1);
    }

    try {

        fs.mkdirSync(projectPath, { recursive: true });
        createProject(projectName);
    } catch (error) {

        console.error(chalk.red('Error creating project directory:'), error);
        process.exit(1);
    }
}

main();
