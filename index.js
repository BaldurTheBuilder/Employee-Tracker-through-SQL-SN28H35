const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const db = mysql.createConnection(
    {
      host: 'localhost',
      port: PORT,
      user: 'root',
      password: process.env.DB_PASSWORD,
      database: 'company_db'
    }
  );

// WHEN I start the application I am presented with the following options: 
// view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
const ourPrompt = {
    type:'list',
    name:'choiceOfAction',
    message:'Please select what you would like to do: ',
    choices:['View all departments','View all roles','View all employees','Add a department','Add a role','Add an employee','Update employee role']
};

function runProgram() {
    return inquirer
        .prompt(ourPrompt)
        .then((data) => {
            const userChoice = data.choiceOfAction;
            console.log(`you selected: ${userChoice}`);
            switch (userChoice) {
                case 'View all departments':
                    console.log('1');
                    break;
                case 'View all roles':
                    console.log('2');
                    break;
                case 'View all employees':
                    console.log('3');
                    break;
                case 'Add a department':
                    console.log('4');
                    break;
                case 'Add a role':
                    console.log('5');
                    break;
                case 'Add an employee':
                    console.log('6');
                    break;
                case 'Update employee role':
                    console.log('7');
                    break;
                default:
                    console.log(`something really went wrong for you to read this.`);
                    break;
            }
        });
};



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

 runProgram();

// WHEN I choose to view all departments I am presented with a formatted table showing department names and department ids

// WHEN I choose to view all roles I am presented with the job title, role id, the department that role belongs to, 
//and the salary for that role

// WHEN I choose to view all employees I am presented with a formatted table showing employee data, including employee ids,
// first names, last names, job titles, departments, salaries, and managers that the employees report to

// WHEN I choose to add a department I am prompted to enter the name of the department and that department is added to the database

// WHEN I choose to add a role I am prompted to enter the name, salary, and department for the role and that role is added to 
//the database

// WHEN I choose to add an employee I am prompted to enter the employee’s first name, last name, role, and manager, and that 
//employee is added to the database

// WHEN I choose to update an employee role I am prompted to select an employee to update and their new role and this 
//information is updated in the database 