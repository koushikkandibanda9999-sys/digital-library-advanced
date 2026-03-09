const API="http://localhost:5000"

/* LOGIN */

function login(){

const email=document.getElementById("email").value
const password=document.getElementById("password").value

fetch(`${API}/auth/login`,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({email,password})
})
.then(res=>res.json())
.then(data=>{

if(data.token){

alert("Login successful")

localStorage.setItem("token",data.token)

window.location="dashboard.html"

}else{

alert(data.message || "Wrong email or password")

}

})

}

/* REGISTER */

function register(){

const username=document.getElementById("username").value
const email=document.getElementById("email").value
const password=document.getElementById("password").value

fetch(`${API}/auth/register`,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({username,email,password})
})
.then(res=>res.json())
.then(data=>{

alert("Registration successful")

window.location="login.html"

})

}

function goRegister(){
window.location="register.html"
}

function goLogin(){
window.location="login.html"
}

/* NAVIGATION */

function showSection(id){

document.querySelectorAll(".section").forEach(s=>{
s.style.display="none"
})

document.getElementById(id).style.display="block"

}

/* LOGOUT */

function logout(){
localStorage.removeItem("token")
window.location="login.html"
}

/* LOAD BOOKS */

function loadBooks(){

fetch(`${API}/library/books`)
.then(res=>res.json())
.then(data=>{

const list=document.getElementById("bookList")
const bookDropdown=document.getElementById("bookSelect")
const issueDropdown=document.getElementById("issueSelect")

if(list) list.innerHTML=""
if(bookDropdown) bookDropdown.innerHTML="<option>Select Book</option>"
if(issueDropdown) issueDropdown.innerHTML="<option>Select Issued Book</option>"

data.forEach(book=>{

if(list){

list.innerHTML+=`

<div class="book-card">

<img src="https://cdn-icons-png.flaticon.com/512/2232/2232688.png">

<h4>${book.title}</h4>

<p>${book.author}</p>

<p>Status: ${book.available?"Available":"Issued"}</p>

<p>${book.taken_by?`Taken by ${book.taken_by}`:""}</p>

<button onclick="deleteBook(${book.id})">Delete</button>

</div>

`

}

if(bookDropdown && book.available){

bookDropdown.innerHTML+=`

<option value="${book.id}">
${book.title}
</option>

`

}

if(issueDropdown && !book.available){

issueDropdown.innerHTML+=`

<option value="${book.issue_id}">
${book.title} - ${book.taken_by}
</option>

`

}

})

document.getElementById("totalBooks").innerText=data.length

let issued=data.filter(b=>!b.available).length
document.getElementById("issuedBooks").innerText=issued

let returned=data.filter(b=>b.available).length
document.getElementById("returnedBooks").innerText=returned

updateChart(issued,returned)

})

}

/* LOAD STUDENTS */

function loadStudents(){

fetch(`${API}/library/students`)
.then(res=>res.json())
.then(data=>{

const studentDropdown=document.getElementById("studentSelect")

if(!studentDropdown) return

studentDropdown.innerHTML="<option>Select Student</option>"

data.forEach(student=>{

studentDropdown.innerHTML+=`

<option value="${student.id}">
${student.name}
</option>

`

})

})

}

/* LOAD STUDENTS TABLE */

function loadStudentsTable(){

fetch(`${API}/library/students`)
.then(res=>res.json())
.then(data=>{

const table=document.getElementById("studentList")

if(!table) return

table.innerHTML=""

data.forEach(student=>{

table.innerHTML+=`

<tr>
<td>${student.id}</td>
<td>${student.name}</td>
</tr>

`

})

})

}

/* ADD BOOK */

function addBook(){

const title=document.getElementById("newTitle").value
const author=document.getElementById("newAuthor").value

if(!title || !author){

alert("Enter title and author")

return

}

fetch(`${API}/library/addbook`,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({title,author})
})
.then(res=>res.json())
.then(data=>{

alert(data.message)

document.getElementById("newTitle").value=""
document.getElementById("newAuthor").value=""

loadBooks()

})

}

/* DELETE BOOK */

function deleteBook(id){

fetch(`${API}/library/deletebook`,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({id})
})
.then(res=>res.json())
.then(data=>{

alert(data.message)

loadBooks()

})

}

/* ISSUE BOOK */

function issueBook(){

const user_id=document.getElementById("studentSelect").value
const book_id=document.getElementById("bookSelect").value

if(!user_id || !book_id){

alert("Please select student and book")

return

}

fetch(`${API}/library/issue`,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({user_id,book_id})
})
.then(res=>res.json())
.then(data=>{

alert(data.message)

loadBooks()
loadHistory()

})

}

/* RETURN BOOK */

function returnBook(){

const issue_id=document.getElementById("issueSelect").value

if(!issue_id){

alert("Please select issued book")

return

}

fetch(`${API}/library/return`,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({issue_id})
})
.then(res=>res.json())
.then(data=>{

alert(data.message)

loadBooks()
loadHistory()

})

}

/* SEARCH BOOKS */

function searchBooks(){

const value=document.getElementById("searchBook").value.toLowerCase()

document.querySelectorAll(".book-card").forEach(card=>{

card.style.display=
card.innerText.toLowerCase().includes(value)?"block":"none"

})

}

/* LOAD HISTORY */

function loadHistory(){

fetch(`${API}/library/books`)
.then(res=>res.json())
.then(data=>{

const table=document.getElementById("historyList")

if(!table) return

table.innerHTML=""

data.forEach(book=>{

if(book.issue_date){

table.innerHTML+=`

<tr>

<td>${book.title}</td>
<td>${book.taken_by || "-"}</td>
<td>${book.issue_date || "-"}</td>
<td>${book.return_date || "-"}</td>
<td>${book.fine || 0}</td>

</tr>

`

}

})

})

}

/* CHART */

let chart

function createChart(){

const ctx = document.getElementById("chart").getContext("2d")

chart = new Chart(ctx,{

type:"doughnut",

data:{
labels:["Issued Books","Available Books"],
datasets:[{
data:[0,0],
backgroundColor:[
"#ff6b6b",
"#4ecdc4"
],
borderWidth:1
}]
},

options:{
responsive:true,
maintainAspectRatio:false,
plugins:{
legend:{
position:"bottom"
}
}
}

})

}

function updateChart(issued,available){

if(chart){

chart.data.datasets[0].data=[issued,available]
chart.update()

}

}
/* DOWNLOAD PDF REPORT */

function downloadReport(){

fetch(`${API}/library/books`)
.then(res=>res.json())
.then(data=>{

const { jsPDF } = window.jspdf

const doc = new jsPDF()

doc.text("Digital Library Report",20,20)

let y = 40

data.forEach((book,index)=>{

doc.text(
`${index+1}. ${book.title} - ${book.author} - ${book.available?"Available":"Issued"}`,
20,
y
)

y += 10

if(y > 270){
doc.addPage()
y = 20
}

})

doc.save("library-report.pdf")

})

}
/* ================= SAFE DELETE CONFIRMATION ================= */

const oldDeleteBook = deleteBook

deleteBook = function(id){

const confirmDelete = confirm("Are you sure you want to delete this book?")

if(!confirmDelete) return

oldDeleteBook(id)

}


/* ================= FINAL PROFESSIONAL PDF REPORT ================= */

const oldDownloadReport = downloadReport

downloadReport = function(){

fetch(`${API}/library/books`)
.then(res=>res.json())
.then(data=>{

const { jsPDF } = window.jspdf

const doc = new jsPDF()

/* HEADER */

doc.setFontSize(18)
doc.text("DIGITAL LIBRARY REPORT",60,20)

doc.setFontSize(10)
doc.text("Generated Date: " + new Date().toLocaleDateString(),20,30)

doc.line(20,35,190,35)

/* TABLE HEADER */

let y = 45

doc.setFontSize(11)

doc.text("No",20,y)
doc.text("Book Title",35,y)
doc.text("Author",95,y)
doc.text("Status",160,y)

doc.line(20,48,190,48)

y += 10

/* TABLE DATA */

data.forEach((book,index)=>{

doc.text(String(index+1),20,y)

doc.text(book.title.substring(0,25),35,y)

doc.text(book.author.substring(0,20),95,y)

doc.text(book.available ? "Available" : "Issued",160,y)

y += 10

if(y > 270){
doc.addPage()
y = 20
}

})

/* FOOTER */

doc.line(20,280,190,280)
doc.text("Library Management System",75,287)

doc.save("library-report.pdf")

})

}
/* ================= AUTO REFRESH AFTER ALL ACTIONS ================= */

function refreshAll(){

loadBooks()
loadStudents()
loadStudentsTable()
loadHistory()

}


/* ================= AUTO REFRESH ON PAGE OPEN ================= */

window.onload = function(){

refreshAll()

if(document.getElementById("chart")){
createChart()
}

}


/* ================= BETTER SUCCESS ALERT FOR ISSUE ================= */

const oldIssueBook = issueBook

issueBook = function(){

oldIssueBook()

setTimeout(()=>{
refreshAll()
},500)

}


/* ================= BETTER SUCCESS ALERT FOR RETURN ================= */

const oldReturnBook = returnBook

returnBook = function(){

oldReturnBook()

setTimeout(()=>{
refreshAll()
},500)

}


/* ================= BETTER SUCCESS ALERT FOR ADD BOOK ================= */

const oldAddBook = addBook

addBook = function(){

oldAddBook()

setTimeout(()=>{
refreshAll()
},500)

}