//global object because that's what I have to do
var DATA;
//allows you to request event and budget adding to backend
function addEvent(data){
        fetch('/addEvent',{'method':'POST',body:JSON.stringify(data),headers:{'content-type':'application/json'}});
    }
function addBudget(data){
        fetch('/addBudget',{'method':'POST',body:JSON.stringify(data),headers:{'content-type':'application/json'}});
}
//returns dumb fake loser promise
async function getData() {
    try {
        let response = await fetch(
        '/getData',{
            headers:{'Content-type':"appliaction/json"},
            method:"POST"
        }
    );
        if (!response.ok) {
            //error handling
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const res = await response.json();
        DATA = res;
        return DATA;
   } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}
//returns actual data
function realGetData(){
    getData();
    return DATA;
}