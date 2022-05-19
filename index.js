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
        'SELECT e.emp_id AS ID, e.first_name AS FIRST, e.last_name AS LAST, roles.role_title AS TITLE, departments.dep_name AS DEPARTMENT, m.first_name AS MANAGER FROM employees e JOIN roles ON e.emp_role=roles.role_id JOIN departments ON roles.department_id=departments.dep_id LEFT JOIN employees m ON m.emp_id=e.manager_id ORDER BY e.emp_id',
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

const addDepartment = (deptName) => {
    db.execute(
        `INSERT INTO departments(dep_name) VALUES ("${deptName}");`,
        (err, res) => {
            if (err) throw err;
            console.log("");
            console.log("=========================");
            return console.log(`${deptName} added to Departments!`);
        }
    )
// enter name of dept and it is added to DB
};

const addRole = (roleTitle, roleSalary, departmentId) => {
    db.execute(
        `INSERT INTO roles(role_title, role_salary, department_id) VALUES (${roleTitle},${roleSalary},${departmentId});`,
        (err, res) => {
            if (err) throw err;
            console.log("");
            console.log("=========================");
            return console.log(`${roleTitle} added to Roles!`);
        }
    )
// enter the following and it is added to DB
    // job title
    // salary
    // department
};

const addEmployee = (firstName, lastName, empRole, managerId) => {
    db.execute(
        `INSERT INTO employees(first_name, last_name, emp_role, manager_id) VALUES (${firstName},${lastName},${empRole},${managerId});`,
        (err, res) => {
            if (err) throw err;
            console.log("");
            console.log("=========================");
            return console.log(`${firstName} ${lastName} added to Employees!`);
        }
    )
// enter the follow and it is entered to the DB
    // first name
    // last name
    // role
    // manager
};

const updateEmployeeRole = (empFullName, empRole) => {
    const index = empFullName.indexOf(" ");
    const firstName =empFullName.slice(0,index); 
    const lastName = empFullName.slice(index+1,empFullName.length);
    db.execute(
        `UPDATE employees SET emp_role=${empRole} WHERE first_name=${firstName};`,
        (err, res) => {
            if (err) throw err;
            console.log("");
            console.log("=========================");
            return console.log(`${firstName} ${lastName} added to Employees!`);
        }
    )
// prompted to select employee
// find their new role 
// then this information is updated in the DB
};

promptUser()
    // .then(() => {
    //     throw console.log("Session has ended.");
    // });

