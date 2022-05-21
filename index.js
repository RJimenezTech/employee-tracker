// const express = require('express');
const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

const { append } = require('express/lib/response');
const { end } = require('./db/connection');

/* ====== INITIALIZE TABLE VIEWS ====== */
/* This is for access to arrays of departments, roles, 
and employees for later use */
let rolesArray = [];
let departmentsArray = [];
let employeesArray = [];

const genArrays = () => {
    db.connect( err => {
        if (err) {
            console.log("error connecting - " + err.message);
            return;
        }
        db.query(`SELECT * FROM roles`, (err , res) => {
            rolesArray = res.map(role => ({name: role.role_title, value: role.role_id}))
        });
        db.query(`SELECT * FROM departments`, (err, res) => {
            departmentsArray = res.map(dep => ({name: dep.dep_name, value: dep.dep_id}))
        });
        db.query(`SELECT * FROM employees`, (err, res) => {
            employeesArray = res.map(emp => ({name: `${emp.first_name} ${emp.last_name}`, value: emp.emp_id}))
        });
    })
    // console.log(rolesArray);
    // console.log(departmentsArray);
    // console.log(employeesArray);
}
/* ====== MAIN MENU ====== */
async function promptUser(){
    await genArrays();
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
        } else if (choiceData.userChoice === "Add an Employee"){
            promptAddEmployee();
        } else if (choiceData.userChoice === "Update an Employee"){
            promptUpdateEmployee();
        } else {
            db.end();
            console.log("Session has ended!");
            process.exit();
        }
    })
};
/* ====== VIEW TABLE CONTENTS FUNCTIONS ====== */
const viewDepartments = () => {
    db.execute(
        'SELECT dep_id AS ID, dep_name AS NAME FROM departments',
        (err, res) => {
            if (err) throw err;
            console.log("");
            console.log("=========================")
            console.log("DEPARTMENTS")
            console.table(res);
            promptUser();
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
            promptUser();
        }
    )
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
            promptUser();
        }
    )
};
/*====== ADD DEPARTMENT FUNCTIONS ======*/
const addDepartment = (deptName) => {
    db.query(
        `INSERT INTO departments(dep_name) VALUES (?);`,[deptName],
        (err, res) => {
            if (err) throw err;
            console.log(`${deptName} added to Departments!`);
            console.log("=========================");
            genArrays();
            promptUser();
        }
    )
    
};
const promptAddDepartment = () => {
    inquirer
        .prompt([
        {
            type: "input",
            name: "departmentInput",
            message: "What is the name of the new department?",
        }
    ])
    .then(departmentData => {
        addDepartment(departmentData.departmentInput);
    })
};
/*====== ADD ROLE FUNCTIONS ======*/
const addRole = (roleTitle, roleSalary, department) => {
    const sql = `INSERT INTO roles(role_title, role_salary, department_id) VALUES (?,?,?)`;
    const params = [roleTitle, roleSalary, department]
    db.query(sql, params, (err, res) => {
        if (err) throw err;

        console.log(`${roleTitle} added to Roles!`);
        console.log("=========================");
        genArrays();
        promptUser();    
    })
};
const promptAddRole = () => {
    inquirer
        .prompt([
        {
            type: "input",
            name: "roleName",
            message: "What is the name of the role?",
        },
        {
            type: "input",
            name: "roleSalary",
            message: "What is the salary of the role?",
        },
        {
            type: "list",
            name: "roleDepartment",
            message: "What department does the role belong to?",
            choices: departmentsArray
        }
    ])
    .then(roleData => {
        addRole(roleData.roleName, roleData.roleSalary, roleData.roleDepartment);
    })
};
/* ====== ADD EMPLOYEE FUNCTIONS ====== */
const addEmployee = (firstName, lastName, roleId, manager_id) => {
    const sql = `INSERT INTO employees(first_name, last_name,emp_role, manager_id) VALUES (?,?,?,?)`;
    const params = [firstName,lastName,roleId,manager_id]
    db.execute(sql, params,(err, res) => {
        if (err) throw err; 
        console.log(`${firstName} ${lastName} was added to employees!`);
        genArrays();
        promptUser();
    });
    
};
const promptAddEmployee = () => {  
    inquirer
        .prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the employee's first name?",
            },
            {
                type: "input",
                name: "lastName",
                message: "What is the employee's last name?",
            },
            {
                type: "list",
                name: "manager",
                message: "Who is the employee's manager?",
                choices: employeesArray
            },
            {
                type: "list",
                name: "roleTitle",
                message: "What is the employee's title?",
                choices: rolesArray
            }
            
        ])
        .then(empData => {
            addEmployee(empData.firstName, empData.lastName, empData.roleTitle, empData.manager);
        })
};
/* ====== UPDATE EMPLOYEE ROLE FUNCTIONS ====== */
const updateEmployeeRole = (empId, role_id) => {
    db.execute(
        `UPDATE employees SET emp_role=? WHERE emp_id=?;`,
        [role_id, empId],
        (err, res) => {
            if (err) throw err;
            console.log("");
            console.log("=========================");
            console.log(`Employee role update!`);
            genArrays();  
            promptUser();
        }
    )
      
};

const promptUpdateEmployee = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "employeeName",
            message: "Which employee do you want to update?",
            choices: employeesArray
        },
        {
            type: "list",
            name: "role",
            message: "What is the employee's new role?",
            choices: rolesArray
        }
    ])
    .then(updateData => {
        updateEmployeeRole(updateData.employeeName, updateData.role);
    })

}

// genArrays();
promptUser();