const mysql = require("mysql");
const inquirer = require("inquirer");
// const logo = require('asciiart-logo');


const connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "EmployeeTracker_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  runApp();
});

function runApp() {
    inquirer
    .prompt({
      name: "option",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All roles",
        "View All departments",
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Department",
        "Add role",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "Quit"
      ]
    })
    .then(function (answer){
        switch (answer.option){
        case "View All Employees":
            viewEmployeesAll();
            break;  
            
        case "View All roles":
              viewRoleAll();
              break;  
              
        case "View All departments":
            viewDepartmentAll();
            break;  
            
        case "View All Employees By Department":
            ViewEmployeesByDepartment();
            break;

        case "View All Employees By Manager":
            viewEmployeesManager();
            break;    
        
        case  "Add Department":
            AddDepartment();
            break;

        case  "Add role":
            Addrole();
            break;

        case  "Add Employee":
            addEmployees();
            break;
            
        case "Remove Employee":
            removeEmployees();
            break;
            
        case "Update Employee Role":
            updateEmployeesRole();
            break;

        case "Update Employee Manager":
            updateEmployeesManager();
            break;  
            default:
            quit();  
        }
    });
}

function viewEmployeesAll(){
  let query = "SELECT * FROM employee";
  connection.query(query,function (err,res){
    if (err) throw err;
    console.table(res);
    runApp();
  });
}
function viewRoleAll(){
  let query = "SELECT * FROM role";
  connection.query(query,function (err,res){
    if (err) throw err;
    console.table(res);
    runApp();
  });
}
function viewDepartmentAll(){
  let query = "SELECT * FROM department";
  connection.query(query,function (err,res){
    if (err) throw err;
    console.table(res);
    runApp();
  });
}
function ViewEmployeesByDepartment(){
  let query = "SELECT first_name, last_name, department.name FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);";
  connection.query(query,function (err,res){
    if (err) throw err;
    console.table(res);
    runApp();
  });
}
function viewEmployeesManager(){
  let query = "SELECT first_name, last_name,manager_id FROM employee";
  connection.query(query,function (err,res){
    if (err) throw err;
    console.table(res);
    runApp();
  });
}
function AddDepartment(){
  let query = "SELECT * FROM department";
  connection.query(query,function(err,res){
    if(err) throw err;
    console.table(res);
  inquirer
  .prompt([
    {
      name: "departmentName",
      type:"input",
      message: "What is the name of the department?"
    }
  ])
  .then(function(answer){
    let query = "INSERT INTO department (name) VALUES (?)";
    console.log(answer);
    connection.query(query,{name:answer.departmentName},function (err,res){
      if (err) throw err;
      console.table (res);
      runApp();

    });
  });
  }); 
}
function Addrole(){
  let query = "SELECT title,salary,department_id FROM role";
  connection.query(query,function(err,res){
    if(err) throw err;
    console.table(res);
  inquirer
  .prompt([
    {
      name: "title",
      type: "input",
      message: "What is the title of the role?"
    },
    {
      name: "salaryTotal",
      type: "input",
      message: "What is the salary for this role?"
    },
    {
      name: "deptID",
      type: "list",
      message: "What is the department for the role?",
      choices: res.map(function(department){
        return {value:department.id};
      }) 
    },
  ])
  .then(function(answer) {
    let deptID = answer.deptID;
    let title = answer.title;
    let salary = answer.salaryTotal;
    let query = "INSERT INTO role (title, salary,department_id) VALUES (?, ?, ?)";
    console.log(answer);
    connection.query(query, [title, salary, deptID], function(err, res) {
      if (err) throw err;
      console.table(res);
      runApp();
    });
  });
  });
}
function addEmployees(){
  inquirer
  .prompt([
    {
      name: "firstName",
      type:"input",
      message: "What's the first name of the employee?"
    },
    {
      name: "lastName",
      type:"input",
      message: "What's the last name of the employee?"
    },
    {
      name: "roleID",
      type:"input",
      message: "What's the employee's role id number?"
    },
    {
      name: "managerID",
      type:"input",
      message: "What's the manager id number?"
    }
  ])
  .then(function(answer){
    let query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
    console.log(answer);
    connection.query(query,[answer.firstName,answer.lastName,answer.roleID,answer.managerID],function (err,res){
      if (err) throw err;
      console.table (res);
      runApp();
    });
  });
}
function removeEmployees(){
  let query = "SELECT id,first_name,last_name FROM employee";
  connection.query(query,function(err,res){
    if(err) throw err;
    // console.table(res);
    inquirer
    .prompt([
      {
        name:"employeeRemove",
        type: "list",
        message: "which employee would you like to remove?",
        choices: res.map(function(employee){
          return {name: employee.id +" "+ employee.first_name + " " + employee.last_name, value: employee.id};
        })
      }
    ])
    .then(function(answer){
      console.log(answer);
      let query = "DELETE FROM employee WHERE ?";
      connection.query(query,{id:answer.employeeRemove},function(err,res){
        if (err) throw err;
        console.table (res);
        runApp();

      })
    })
  })
} 
function updateEmployeesRole(){
  let query = "SELECT first_name,last_name,role_id FROM employee"
  connection.query(query,function(err,res){
    if(err) throw err;
    inquirer
    .prompt([
      {
        name:"employeeInfo",
        type: "list",
        message: "Choose the employee for updating.",
        choices: res.map(function(employee){
          return {name: employee.first_name +" "+ employee.last_name + " " + employee.role_id, value: employee.role_id};
        })
      },
      {
        name:"updateRole",
        type: "input",
        message: "change the ID.",
      }
    ])
    .then(function(answer){
      console.log(answer);
      let query = "UPDATE employee SET role_id=? WHERE first_name= ?";
      connection.query(query,{roleId:answer.updateRole},function(err,res){
        if (err) throw err;
        runApp();
      })
    }) 
  })
}     
function updateEmployeesManager(){
  let query = "SELECT first_name,last_name,manager_id FROM employee";
  connection.query(query,function(err,res){
    if(err) throw err;
    console.table(res);
    inquirer
    .prompt([
      {
        name: "empName",
        type: "list",
        message: "Choose the employee.",
        choices: res.map(function(updateEmpMan){
          return {name: updateEmpMan.first_name + updateEmpMan.last_name + updateEmpMan.last_name + updateEmpMan.manager_id, value:updateEmpMan.manager_id};
        })
      }
    ])
    .then(function(answer){
      console.log(answer);   
                let query = "UPDATE FROM employee WHERE manager_id?";
                connection.query(query,{id:answer.empName},function(err,res){
                if (err) throw err;
                console.log(res);
                runApp();
                });
              })
            });   
}           
function quit(){
  connection.end();
  process.exit();
}

