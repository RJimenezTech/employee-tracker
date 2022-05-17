const express = require('express');
const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

const promptUser = () => {
    return inquirer.prompt([
        {
            type: "list",
            name: "userChoice",
            message: "What would you like to do?",
            choices: 
            [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update an Employee",
                "End Session"
            ]
        }
    ])
    .then(choiceData => {
        if (choiceData.userChoice === "View All Departments") {
            viewDepartments();
            return promptUser();    
        } else if (choiceData.userChoice === "View All Roles") {
            viewRoles();
            return promptUser();
        } else if (choiceData.userChoice === "View All Employees") {
            viewEmployees();
            return promptUser();
        }
    })
};

const viewDepartments = () => {
    db.execute(
        'SELECT dep_id AS ID, dep_name AS name FROM departments',
        (err, res) => {
            if (err) throw err;
            console.log("");
            console.log("=========================")
            console.log("DEPARTMENTS")
            return console.table(res);
        }
    )
};

const viewRoles = () => {
    db.execute(
        'SELECT roles.role_id AS ID, roles.role_title AS TITLE, roles.role_salary AS SALARY, departments.dep_name AS DEPARTMENT FROM roles INNER JOIN departments ON roles.department_id=departments.dep_id',
        (err, res) => {
            if (err) throw err;
            console.log("");
            console.log("=========================")
            console.log("ROLES");
            return console.table(res);
        }
    )
// presented a formatted tabled showing:
    // job title
    // role id
    // department the role belongs to
    // salaray for that role
};

const viewEmployees = () => {
    db.execute(
        'SELECT employees.emp_id AS ID, employees.first_name AS FIRST, employees.last_name AS LAST, roles.role_title AS TITLE FROM employees JOIN roles ON employees.emp_role=roles.role_id',
        (err, res) => {
            if (err) throw err;
            console.log("");
            console.log("=========================");
            console.log("EMPLOYEES");
            return console.table(res);
        }
    )
// presented a formatted table with the following
    // employee ids
    // first names
    // last names
    // job titles
    // departments
    // salaries
    // employees' manager
};

const addDepartment = () => {
    return console.log("TEMPLATE LITERAL department was added to departments.");
// enter name of dept and it is added to DB
};

const addRole = () => {
    return console.log("TEMPLATE LITERAL was added to roles.");
// enter the following and it is added to DB
    // job title
    // salary
    // department
};

const addEmployee = () => {
    return console.log("TEMPLATE LITERAL was added to employees.");
// enter the follow and it is entered to the DB
    // first name
    // last name
    // role
    // manager
};

const updateEmployeeRole = () => {
    return console.log("TEMPLATE LITERAL's employee records were updated.");
// prompted to select employee
// find their new role 
// then this information is updated in the DB
};

promptUser()
    // .then(() => {
    //     throw console.log("Session has ended.");
    // });

