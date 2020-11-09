const mysql = require("mysql");
const inquirer = require("inquirer");


const connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "Elinarry28$%",
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
        "View All Employees By Department",
        "View All Employees By Manager",
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
        
        case "View All Employees By Department":
            ViewEmployeesByDepartment();
            break;

        case "View All Employees By Manager":
            viewEmployeesManager();
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
function ViewEmployeesByDepartment(){
  let query = "SELECT * FROM department";
  connection.query(query,function (err,res){
    if (err) throw err;
    console.table(res);
    runApp();
  });
}
function viewEmployeesManager(){
  let query = "SELECT * FROM role";
  connection.query(query,function (err,res){
    if (err) throw err;
    console.table(res);
    runApp();
  });
}
function addEmployees(){
  inquirer
  .prompt([
    {
      name: "FirstName",
      type:"input",
      message: "What's the first name of the employee?"
    },
    {
      name: "LastName",
      type:"input",
      message: "What's the last name of the employee?"
    },
    {
      name: "RoleID",
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
    connection.query
    ("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",[answer.FirstName,answer.LastName,answer.RoleID,answer.managerID],function (err,res){
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
        runApp();

      })
    })
  })
} 
function updateEmployeesRole(){
  let query = "SELECT id,title,salary FROM role"
  connection.query(query,function(err,res){
    if(err) throw err;
    inquirer
    .prompt([
      {
        name:"updateRole",
        type: "list",
        message: "Choose the role.",
        choices: res.map(function(role){
          return {name: role.id +" "+ role.title + " " + role.salary, value: role.id};
        })
        },
    ])
    .then(function(answer){
      console.log(answer);
      let query = "UPDATE FROM role WHERE ?";
      connection.query(query,{role:answer.updateRole},function(err,res){
        if (err) throw err;
        runApp();
      })
    })
  })
}     
function updateEmployeesManager(){
  let employees = connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
  // employees.push({ id: null, name: "Cancel" });

  inquirer.prompt([
      {
          name: "empName",
          type: "list",
          message: "Choose the employee who you want to shift.",
          choices: employees.map(obj => obj.name)
      }
  ]).then(employeeInfo => {
      if (employeeInfo.empName == "Cancel") {
          runApp();
          return;
      }
      let managers = employees.filter(currEmployee => currEmployee.name != employeeInfo.empName);
      for (i in managers) {
          if (managers[i].name === "Cancel") {
              managers[i].name = "None";
          }
      };

      inquirer.prompt([
          {
              name: "mgName",
              type: "list",
              message: "Change their manager to:",
              choices: managers.map(obj => obj.name)
          }
      ]).then(managerInfo => {
          let empID = employees.find(obj => obj.name === employeeInfo.empName).id
          let mgID = managers.find(obj => obj.name === managerInfo.mgName).id
          db.query("UPDATE employee SET manager_id=? WHERE id=?", [mgID, empID]);
          console.log("\x1b[32m", `${employeeInfo.empName} now reports to ${managerInfo.mgName}`);
          runApp();
      })
  })
    
}
function quit(){
  connection.end();
  process.exit();
}

