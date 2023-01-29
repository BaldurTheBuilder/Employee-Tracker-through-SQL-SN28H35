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
    message:`what's the name of the new department? `,
    validate: (answer) => {
        if(!answer) {
            return `you haven't selected a department to add. Please make a selection.`;
        }
        else return true;
    }
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
            db.query(`INSERT INTO department (department_name) VALUES (?)`, answers.deptName);
            console.log(`Added ${answers.deptName} to the database.`);
        });
    mainMenu();
};

// WHEN I choose to add a role I am prompted to enter the name, salary, and department for the role and that role is added to the database
function addRole() {
    let departmentsList = [];
    db.query('SELECT * FROM department', function (err, results) {
        departmentsList = results.map((dept => {
            return {
            value: dept.id,
            name: dept.department_name
            }
        }));

        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: `What's the role's title? `
            },
            {
                type: 'input',
                name: 'salary',
                message: `What salary does the role pay? `
            },
            {
                type: 'list',
                name: 'department',
                message: `What department does the role belong to?`,
                choices: departmentsList
            }
        ])
        .then ((values) => {
            db.execute(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`, [values.title, values.salary, values.department]);
            console.log(`Added ${values.title} to the database.`);
        })
        .then (() => {
            mainMenu();
        });
    });
};

// WHEN I choose to add an employee I am prompted to enter the employee’s first name, last name, role, and manager, and that 
//employee is added to the database
function addEmployee() {
    let roleList = [];
    db.query('SELECT * FROM role', function (err, results) {
        roleList = results.map((role => {
            return {
            value: role.id,
            name: role.title
            }
        }));

            let managerList = [];
        db.query('SELECT * FROM employees', function (err, results) {
            managerList = results.map((manager => {
                return {
                value: manager.id,
                name: manager.first_name.concat(' ',manager.last_name)
                }
            }));
            managerList.unshift({value: null, name: "No manager"});

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: `What's the employee's first name? `
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: `What's the employee's last name? `
                },
                {
                    type: 'list',
                    name: 'role',
                    message: `What is the employee's role? `,
                    choices: roleList
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: `Who is the employee's manager? `,
                    choices: managerList
                }
            ])
            .then ((values) => {
                db.execute(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [values.first_name, values.last_name, values.role, values.manager]);
                console.log(`added ${values.first_name.concat(' ',values.last_name)} to the database.`);
            })
            .then (() => {
                mainMenu();
            });
        });
    });
};

// WHEN I choose to update an employee role I am prompted to select an employee to update and their new role and this 
//information is updated in the database 
function updateEmployee() {
    let roleList = [];
    db.query('SELECT * FROM role', function (err, results) {
        roleList = results.map((role => {
            return {
            value: role.id,
            name: role.title
            }
        }));

        let employeeList = [];
        db.query('SELECT * FROM employees', function (err, results) {
            employeeList = results.map((person => {
                return {
                value: person.id,
                name: person.first_name.concat(' ',person.last_name)
                }
            }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'chosenEmployee',
                    message: `Which employee do you want to update? `,
                    choices: employeeList
                },
                {
                    type: 'list',
                    name: 'role',
                    message: `What is the employee's new role? `,
                    choices: roleList
                },

            ])
            .then ((chosenData) => {
                db.execute(`UPDATE employees SET role_id = ? WHERE id = ? `, [chosenData.role, chosenData.chosenEmployee]);
                console.log(`updated the role for ${employeeList[chosenData.chosenEmployee - 1].name} to ${roleList[chosenData.role - 1].name}`)
            })
            .then (() => {
                mainMenu();
            });
        });
    });
};

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

 mainMenu();

