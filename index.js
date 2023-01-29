const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    console.log('connected to company_db.')
  );

// WHEN I start the application I am presented with the following options: 
// view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
const mainPrompt = {
    type:'list',
    name:'choiceOfAction',
    message:'Please select what you would like to do: ',
    choices:['View all departments','View all roles','View all employees','Add a department','Add a role','Add an employee','Update employee role']
};

const departmentPrompt = {
    type: 'input',
    name:'deptName',
    message:`what's the name of the new department? `
};

function mainMenu() {
    return inquirer
        .prompt(mainPrompt)
        .then((data) => {
            switch (data.choiceOfAction) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update employee role':
                    updateEmployee();
                    break;
                default:
                    console.log(`something really went wrong for you to read this.`);
                    break;
            }
        });
};

// WHEN I choose to view all departments I am presented with a formatted table showing department names and department ids
function viewDepartments() {
    db.query('SELECT * FROM department ORDER BY department.id', function (err, results) {
        console.table(results);
        mainMenu();
    });
};

// WHEN I choose to view all roles I am presented with the job title, role id, the department that role belongs to, and the salary for that role
function viewRoles() {
    db.query(`SELECT role.id, role.title, department.department_name, role.salary FROM role 
    JOIN department ON role.department_id = department.id
    ORDER BY role.id`, function (err, results) {
        console.table(results);
        mainMenu();
    });
};

// WHEN I choose to view all employees I am presented with a formatted table showing employee data, including employee ids,
// first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewEmployees() {
    db.query(`SELECT employees.id, CONCAT(employees.first_name, ' ', employees.last_name) AS employee_name, role.title, department.department_name, role.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name FROM employees
        LEFT JOIN employees manager on manager.id = employees.manager_id 
        JOIN role ON employees.role_id = role.id
        JOIN department ON role.department_id = department.id`, 
        function (err, results) {
            console.table(results);
            mainMenu();
        }
    );
};

// WHEN I choose to add a department I am prompted to enter the name of the department and that department is added to the database
async function addDepartment() {
    await inquirer.prompt(departmentPrompt)
        .then(answers => {
            db.query(`INSERT INTO department (department_name) VALUES (?)`, answers.deptName)}
        );
    mainMenu();
};

function addRole() {

};

function addEmployee() {

};

function updateEmployee() {

};

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

 mainMenu();


// WHEN I choose to add a role I am prompted to enter the name, salary, and department for the role and that role is added to 
//the database

// WHEN I choose to add an employee I am prompted to enter the employee’s first name, last name, role, and manager, and that 
//employee is added to the database

// WHEN I choose to update an employee role I am prompted to select an employee to update and their new role and this 
//information is updated in the database 