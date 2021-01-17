const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ todos: [], completed: 0, notCompleted: 0 }).write();

const arg = process.argv;
if (arg.length == 2) {
  usage();
} else {
  switch (arg[2]) {
    case "add":
      newTodo(arg[3]);
      break;
    case "ls":
      getTodos();
      break;
    case "done":
      done(arg[3]);
      break;
    case "del":
      del(arg[3]);
      break;
    case "report":
      report();
      break;
    case "help":
      usage();
      break;
  }
}

// usage represents the help guide
function usage() {
  const usageText = 
`Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls              # Show remaining todos
$ ./todo del NUMBER      # Delete a todo
$ ./todo done NUMBER     # Complete a todo
$ ./todo help            # Show usage
$ ./todo report          # Statistics`

  console.log(usageText);
}

// add to do
function newTodo(q) {
  // add todo
  db.get("todos")
    .push(q)
    .write();
  // increases pendings
  let pending = db.get("notCompleted").value();
  pending++;
  db.set(`notCompleted`, pending).write();
  console.log(`Added todo: "${q}"`);
}

// get all to do

function getTodos() {
  const todos = db.get("todos").value();
  let index = todos.length;
  for (let i = index - 1; i >= 0; i--) {
    const todoText = `[${index--}] ${todos[i]}`;
    console.log(todoText);
  }
}

//delete a todo
function del(i) {
  let v = i - 1;
  db.get("todos").pullAt(v).write();
  

  // decreases pending
  let pending = db.get("notCompleted").value();
  pending--;
  db.set(`notCompleted`, pending).write();
  console.log(`Deleted todo #${i}`);
}

//done
function done(i) {
  let v = i - 1;
  db.get("todos").pullAt(v).write();
  // decreases pending
  let pending = db.get("notCompleted").value();
  pending--;
  db.set(`notCompleted`, pending).write();
  //increses completed
  let completed = db.get("completed").value();
  completed++;
  db.set(`completed`, completed).write();

  console.log(`Marked todo #${i} as done.`);
}

// report

function report() {
  var datetime = new Date();
  let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");

  const pending = db.get("notCompleted").value();
  const completed = db.get("completed").value();
  const reportText = `${date}/${month}/${year} Pending : ${pending} Completed : ${completed}`;
  console.log(reportText);
}
