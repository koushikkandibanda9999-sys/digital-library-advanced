function showCode(type) {
    const display = document.getElementById("codeDisplay");

    if (type === "insert") {
        display.textContent = `
CREATE TRIGGER after_insert_employee
AFTER INSERT ON employees
FOR EACH ROW
INSERT INTO employee_log(emp_id, action_type)
VALUES (NEW.emp_id, 'INSERT');
        `;
    } else {
        display.textContent = `
CREATE TRIGGER after_update_employee
AFTER UPDATE ON employees
FOR EACH ROW
INSERT INTO employee_log(emp_id, action_type)
VALUES (NEW.emp_id, 'UPDATE');
        `;
    }
}

function showReport() {
    const table = document.querySelector("#reportTable tbody");

    table.innerHTML = `
        <tr>
            <td>2026-04-07</td>
            <td>INSERT</td>
            <td>5</td>
        </tr>
        <tr>
            <td>2026-04-07</td>
            <td>UPDATE</td>
            <td>3</td>
        </tr>
    `;
}