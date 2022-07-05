const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const engineer = require("./lib/engineer");
const intern = require("./lib/engineer");
const manager = require("./lib/manager");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const teamArray = [];

const addManager = () => {
    return inquirer.prompt ([
        {
            type: "input",
            name: "name",
            message: "Enter the managers name",
            validate: nameInput => {
                if(nameInput) {
                    return true;
                } else {
                    console.log ("Please enter the managers name");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "id",
            message: "Enter the managers ID",
            validate: nameInput => {
                if (isNaN(nameInput)) {
                    console.log ("Please enter the managers ID");
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            name: "email",
            message: "Enter the managers email",
            validate: email => {
                valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                if (valid) {
                    return true;
                } else {
                    console.log ("Please enter an email");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "officeNumber",
            message: "Enter the managers office number",
            validate: nameInput => {
                if (isNaN(nameInput)) {
                    console.log ("Please enter an office number");
                    return false;
                } else {
                    return true;
                }
            }
        }
    ])
    .then(managerInput => {
        const { name, id, email, officeNumber } = managerInput;
        const manager = new Manager (name, id, email, officeNumber);

        teamArray.push(manager);
        console.log(manager);
    })
};

const addEmployee = () => {
    console.log("Adding employees");
    return inquirer.prompt ([
        {
            type: "list",
            name: "role",
            message: "Choose the employees role",
            choices: ["Engineer", "Intern"]
        },
        {
            type: "input",
            name: "name",
            message: "Enter the employees name",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter the employees name");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "id",
            message: "Enter employees ID",
            validate: nameInput => {
                if (isNaN(nameInput)) {
                    console.log ("Please enter the employees ID");
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            name: "email",
            message: "Enter the employees email address",
            validate: email => {
                valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                if (valid) {
                    return true;
                } else {
                    console.log ("Please enter the employees email");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "github",
            message: "Enter the employees gitHub username",
            when: (input) => input.role === "engineer",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log ("Please enter the employees gitHub");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "school",
            message: "Enter the interns school",
            when: (input) => input.role === "intern",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter the inters school");
                    return false;
                }
            }
        },
        {
            type: "confirm",
            name: "confirmAddEmployee",
            message: "Would you like to add more team members?",
            default: false
        }
    ])
    .then(employeeData => {
        let { name, id, email, role, gitHub, school, confirmAddEmployee } = employeeData;
        let employee;

        if (role === "engineer") {
            employee = new engineer (name, id, email, gitHub);
            console.log(employee);
        } else if (role === "intern") {
            employee = new intern (name, id, email, school);
            console.log(employee);
        }
        teamArray.push(employee);

        if (confirmAddEmployee) {
            return addEmployee(teamArray);
        } else {
            return teamArray;
        }
    })
};

const writeFile = data => {
    fs.writeFile("./dist/index.html", data, err => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("Your team profile has been sucessfully created.")
        }
    })
};
addManager().then(addEmployee).then(teamArray => {
    return render(teamArray);
})
.then(pageHTML => {
    return writeFile(pageHTML);
})
.catch(err => {
    console.log(err);
});