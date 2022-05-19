INSERT INTO departments (dep_name)
VALUES
    ("Manufacturing"),
    ("Human Resources"),
    ("Engineering");

INSERT INTO roles (role_title, role_salary, department_id)
VALUES 
    ("Operator", 50000, 1),
    ("Supervisor", 100000, 1),
    ("Generalist", 65000, 2),
    ("Payroll Specialist", 55000, 2),
    ("Engineer", 120000, 3),
    ("Engineer Manager", 150000, 3);

INSERT INTO employees (first_name, last_name, emp_role, manager_id)
VALUES
    ("John", "Smith", 2, NULL),
    ("Mary", "Helen", 1, 1),
    ("Jose", "Perez", 3, NULL),
    ("Isabela", "Munoz", 4, 3),
    ("Kareem", "Masir", 6, NULL),
    ("Fatima", "Ali", 5, 5);