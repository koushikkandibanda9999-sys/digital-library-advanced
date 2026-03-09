const db = require("../config/db")

/* ================= GET BOOKS ================= */

exports.getBooks = (req,res)=>{

const sql = `
SELECT 
books.id,
books.title,
books.author,
books.available,
users.name AS taken_by,
issues.issue_date,
issues.due_date,
issues.return_date,
issues.fine,
issues.id AS issue_id
FROM books
LEFT JOIN issues
ON books.id = issues.book_id
LEFT JOIN users
ON issues.user_id = users.id
ORDER BY issues.issue_date DESC
`

db.query(sql,(err,result)=>{

if(err){
console.log(err)
return res.status(500).json({message:"Database error"})
}

res.json(result)

})

}

/* ================= GET STUDENTS ================= */

exports.getStudents = (req,res)=>{

const sql = "SELECT id,name FROM users"

db.query(sql,(err,result)=>{

if(err){
console.log(err)
return res.status(500).json({message:"Database error"})
}

res.json(result)

})

}

/* ================= ISSUE BOOK ================= */

exports.issueBook = (req,res)=>{

const {book_id,user_id} = req.body

if(!book_id || !user_id){
return res.json({message:"Missing book or student"})
}

const issueDate = new Date()
const dueDate = new Date()

dueDate.setDate(issueDate.getDate()+7)

db.query(
"SELECT available FROM books WHERE id=?",
[book_id],
(err,result)=>{

if(err){
console.log(err)
return res.status(500).json({message:"Database error"})
}

if(result.length===0){
return res.json({message:"Book not found"})
}

if(!result[0].available){
return res.json({message:"Book already issued"})
}

db.query(
"INSERT INTO issues (book_id,user_id,issue_date,due_date,status) VALUES (?,?,?,?,?)",
[book_id,user_id,issueDate,dueDate,'Issued'],
(err)=>{

if(err){
console.log(err)
return res.status(500).json({message:"Issue failed"})
}

db.query(
"UPDATE books SET available=FALSE WHERE id=?",
[book_id],
(err)=>{

if(err){
console.log(err)
return res.status(500).json({message:"Book update failed"})
}

res.json({message:"Book Issued Successfully"})

})

})

})

}

/* ================= RETURN BOOK ================= */

exports.returnBook = (req,res)=>{

const {issue_id} = req.body

if(!issue_id){
return res.json({message:"Issue ID required"})
}

db.query(
"SELECT * FROM issues WHERE id=?",
[issue_id],
(err,result)=>{

if(err){
console.log(err)
return res.status(500).json({message:"Database error"})
}

if(result.length===0){
return res.json({message:"Issue record not found"})
}

const issue = result[0]

const today = new Date()
const due = new Date(issue.due_date)

let fine = 0

if(today > due){

const lateDays = Math.ceil((today-due)/(1000*60*60*24))
fine = lateDays * 10

}

db.query(
"UPDATE issues SET status='Returned', return_date=?, fine=? WHERE id=?",
[today,fine,issue_id],
(err)=>{

if(err){
console.log(err)
return res.status(500).json({message:"Return update failed"})
}

db.query(
"UPDATE books SET available=TRUE WHERE id=?",
[issue.book_id],
(err)=>{

if(err){
console.log(err)
return res.status(500).json({message:"Book update failed"})
}

res.json({
message:"Book Returned Successfully",
fine:fine
})

})

})

})

}

/* ================= ADD BOOK ================= */

exports.addBook = (req,res)=>{

const {title,author} = req.body

if(!title || !author){
return res.json({message:"Title and author required"})
}

db.query(
"INSERT INTO books (title,author,available) VALUES (?,?,TRUE)",
[title,author],
(err)=>{

if(err){
console.log(err)
return res.status(500).json({message:"Book insert failed"})
}

res.json({message:"Book Added Successfully"})

})

}

/* ================= DELETE BOOK ================= */

exports.deleteBook = (req,res)=>{

const {id} = req.body

if(!id){
return res.json({message:"Book ID required"})
}

db.query(
"DELETE FROM books WHERE id=?",
[id],
(err)=>{

if(err){
console.log(err)
return res.status(500).json({message:"Delete failed"})
}

res.json({message:"Book Deleted Successfully"})

})

}