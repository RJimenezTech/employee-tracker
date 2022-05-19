const express = require('express');
const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');
db.connect();
const { append } = require('express/lib/response');

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
 
        } else if (choiceData.userChoice === "View All Roles") {
            viewRoles();

        } else if (choiceData.userChoice === "View All Employees") {
            viewEmployees();

        } else if (choiceData.userChoice === "Add a Department") {
            promptAddDepartment();
        } else if (choiceData.userChoice === "Add a Role") {
            promptAddRole();
        }
    })
};

const promptAddDepartment = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "departmentInput",
            message: "What is the name of the department?",
        }
    ])
    .then(departmentData => {
        addDepartment(departmentData.departmentInput);
    })
};

const promptAddRole = () => {
    let departmentsArray = [];
    db.query(`SELECT * FROM departments`, (err, res) => {
        if (err) throw err;
        res.forEach(dep => {
            departmentsArray.push(dep.dep_name);
        })
        return;
    });

    return inquirer.prompt([
        {
            type: "input",
            name: "roleName",
            message: "What is the name of the role?",
            validate: (roleName) => {
                if (!roleName) {
                    console.log("Must enter a role name!")
                    return false;
                } else return true;
            }
        },
        {
            type: "input",
            name: "roleSalary",
            message: "What is the salary of the role?",
            validate: (roleSalary) => {
                if (!roleSalary) {
                    console.log("Must enter salary!")
                    return false;
                }
                if (typeof roleSalary !== 'number') {
                    return true;
                } else {
                    console.log("Salary must be a number!")
                    return false;
                }
            }
        },
        {
            type: "list",
            name: "roleDepartment",
            message: "What department does the role belong to?",
            choices: departmentsArray,
            validate: (roleDepartment) => {
                if (!roleDepartment) {
                    console.log("Must enter a role department!")
                    return false;
                }
            }
        }
    ])
    .then(roleData => {
        addRole(roleData.roleName, roleData.roleSalary, roleData.roleDepartment);
    })
}

const viewDepartments = () => {
    db.execute(
        'SELECT dep_id AS ID, dep_name AS name FROM departments',
        (err, res) => {
            if (err) throw err;
            console.log("");
            console.log("=========================")
            console.log("DEPARTMENTS")
            console.table(res);
            return promptUser();
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
            console.table(res);
            return promptUser();
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
            console.table(res);
            return promptUser();
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
            console.log(`${deptName} added to Departments!`);
            console.log("=========================");
            return promptUser();
        }
    )
// enter name of dept and it is added to DB
};

const addRole = (roleTitle, roleSalary, departmentName) => {
    let departmentId = "";
    db.execute(`SELECT dep_id FROM departments WHERE dep_name="${departmentName}"`, 
    (err, res) => {
        if (err) throw err;
        departmentId = res[0].dep_id;
        console.log(departmentId + " is here");
        const sql = `INSERT INTO roles(role_title, role_salary, department_id) VALUES ("${roleTitle}",${roleSalary},${departmentId})`; 
        db.execute(sql, (err, res) => {
            if (err) throw err;
            console.log(`${roleTitle} added to Roles in ${departmentName} department!`);
            console.log("=========================");
            return promptUser();
        })
    })       
};

const addEmployee = (firstName, lastName, empRole, managerName) => {
    // find manager id from manager name
    // const managerId = ...
    db.execute(
        `INSERT INTO employees(first_name, last_name, emp_role, manager_id) VALUES (${firstName},${lastName},${empRole},${managerId});`,
        (err, res) => {
            if (err) throw err;
            console.log(`${firstName} ${lastName} added to Employees!`);
            console.log("=========================");
            return promptUser();
        }
    )
// enter the follow and it is entered to the DB
    // first name
    // last name
    // role
    // manager
};

const updateEmployeeRole = (empFullName, empRole,) => {
    const index = empFullName.indexOf(" ");
    const firstName =empFullName.slice(0,index); 
    const lastName = empFullName.slice(index+1,empFullName.length);
    db.execute(
        `UPDATE employees SET emp_role=${empRole} WHERE first_name=${firstName};`,
        (err, res) => {
            if (err) throw err;
            console.log("");
            console.log("=========================");
            console.log(`${firstName} ${lastName} added to Employees!`);
            return promptUser();
        }
    )
// prompted to select employee
// find their new role 
// then this information is updated in the DB
};

promptUser();



