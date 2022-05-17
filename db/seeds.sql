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
    ("emp1-1", "emp1-2", 2, NULL),
    ("emp2-1", "emp2-2", 1, 1),
    ("emp3-1", "emp3-2", 3, NULL),
    ("emp4-1", "emp4-2", 4, 3),
    ("emp5-1", "emp5-2", 6, NULL),
    ("emp6-1", "emp6-2", 5, 5);