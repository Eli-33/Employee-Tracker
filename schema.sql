DROP DATABASE IF EXISTS EmployeeTracker_db;
CREATE database EmployeeTracker_db;

USE EmployeeTracker_db;

CREATE TABLE department (
    name VARCHAR(30) NOT NULL,
    id INT auto_increment PRIMARY KEY NOT NULL
);

CREATE TABLE role (
    id INT AUTO_iNCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL (30) NOT NULL,
    department_id INT NOT NULL,
    INDEX dep_ind (department_id),
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT AUTO_iNCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    INDEX role_ind (role_id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id),
    manager_id INT,
    INDEX man_ind (manager_id),
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id)  
);

