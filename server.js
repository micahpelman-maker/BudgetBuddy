//note: Although I believe it is within the rules, I did not use any AI for this
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
app.use(express.json());
//used to add a grade event to the information json
class gradeEvent{
    //takes in these parameters
    constructor(cost, revenue, name, date = Date.now()){
        this.cost = cost;
        this.revenue = revenue;
        this.name = name;
        //date in mm/dd/yyyy format
        this.date = date;
}
//gets data organized for finding the sum by month or total
getProfit(){
  return this.revenue - this.cost;
}
}
//adds an event to information.json
function addEvent(eve){
    //reads file
 fs.readFile('information.json',(err, data)=>{
        if(err){
            //error handling
            throw new Error (err);
        }
        else{
            x = JSON.parse(data);
            x.events.push(eve);
            fs.writeFile('information.json',JSON.stringify(x),'utf-8',()=>{});
        }
        return true;
    })
    return true;
}
//I could just use a regular loop, but recursion is cooler and also counts for more points lol
function recursiveAddingTotal(array, i=0,totalFinancials={revenue:0,cost:0}){
    if(i < array.length){
        //adds the sum of revenue and costs to input
       totalFinancials.revenue += array[i].revenue;
       totalFinancials.cost += array[i].cost;
        //passes sums to next iterator
        i+=1;
        return recursiveAddingTotal(array,i,totalFinancials);
    }
    else{
        totalFinancials.netProfit = totalFinancials.revenue - totalFinancials.cost;
        return totalFinancials;
    }
}

//reads the json and adds up the total costs and revenue
function getTotals(){
    data = JSON.parse(fs.readFileSync('information.json', 'utf-8'));
    return recursiveAddingTotal(data.events);
}
//gets the allocated funds and money raised from by type

function getBudgets(){
    let z= JSON.parse(fs.readFileSync('information.json'));
    return z.budget;
}
//loads main page, which is blank, just for running front end code 
app.get('/',(req,res)=>{
    res.type('text/html');
    res.sendFile(path.join(__dirname,'index.html'));
})
app.get('/logic.js',(req,res)=>{
res.set('content-type','application/javascript');
res.sendFile(path.join(__dirname,'logic.js'));
})
//post request handling for adding an event
app.post('/addEvent',(req,res)=>{
    let p = req.body
    let e = new gradeEvent(p.cost,p.revenue,p.name,p.date);
    addEvent(e);
})
//allows you to add to the budget
app.post('/addBudget',(res,req)=>{
    var n = res.body;
    fs.readFile('information.json',(err, data)=>{
        if(err)
            throw new Error(err);
        var dat = JSON.parse(data);
        console.log(n);
        dat.budget[n.type] += n.amount;
        fs.writeFile('information.json',JSON.stringify(dat),()=>{});
    });
})
function addBudgets(){
    let x = getBudgets();
    x._comment = 0;
    sum = 0;
    for(let o in x){
        sum+=x[o];
    }
    return sum;
}
 function tt(type){
    let data = JSON.parse(fs.readFileSync('information.json'));
    let sum = 0;
    for(let i = 0; i < data.events.length; i++){
        if(data.events[i].name === type){
            sum += -data.events[i].cost + data.events[i].revenue;
        }
    }
    return sum;
}
//allows the front end to get relevent data
app.post('/getData',(req,res)=>{
    var f = tt('Fundraiser');
    var c = tt('Monthly Canteen');
    var totalsByType = {'Fundraiser':f,'Canteen':c};
    res.type('application/json');
    console.log(getTotals().netProfit)
    console.log(addBudgets());
    console.log(JSON.stringify({totals:getTotals(),totalsByType:totalsByType,budgets:getBudgets(),unallocated_funds:getTotals().netProfit - addBudgets()}));
    res.send(JSON.stringify({totals:getTotals(),totalsByType:totalsByType,budgets:getBudgets(),unallocated_funds:getTotals().netProfit - addBudgets()}));
});
//starts server on port 3000
app.listen(3000,()=>{console.log('server online')});
