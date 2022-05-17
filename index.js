const inquirer = require('inquirer');

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
            viewDepartments()
            promptUser()
        } else if (choiceData.userChoice === "End Session") {
            return;
        }
    })
};

const viewDepartments = () => {
    return console.log("Here are the department:");
    // present a formatted table showing:
    // department names
    // department ids
};

const viewRoles = () => {
    return console.log("Here are the roles:");
// presented a formatted tabled showing:
    // job title
    // role id
    // department the role belongs to
    // salaray for that role
};

const viewEmployees = () => {
    return console.log("Here are the employees:");
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

promptUser();