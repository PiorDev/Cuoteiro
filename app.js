document.getElementById('expenseForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const installments = parseInt(document.getElementById('installments').value, 10);
    const startMonth = document.getElementById('startMonth').value;

    // Obtener los nombres de los meses y calcular el monto por mes
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const startIndex = months.indexOf(startMonth);
    const amountPerMonth = (amount / installments).toFixed(2); // Redondear a 2 decimales

    // Agregar el gasto a la tabla de resumen
    const summaryTable = document.getElementById('expensesTable');
    let row = summaryTable.querySelector(`tr[data-description="${description}"]`);
    
    if (!row) {
        // Si no existe la fila, crear una nueva
        row = document.createElement('tr');
        row.dataset.description = description;

        // Crear la celda de descripción
        let cell = document.createElement('td');
        cell.textContent = description;
        row.appendChild(cell);

        // Crear celdas para cada mes
        for (let i = 0; i < 12; i++) {
            cell = document.createElement('td');
            cell.textContent = '';
            row.appendChild(cell);
        }

        summaryTable.appendChild(row);
    }

    // Actualizar las celdas correspondientes
    for (let i = 0; i < installments; i++) {
        const monthIndex = (startIndex + i) % 12;
        row.children[monthIndex + 1].textContent = (parseFloat(row.children[monthIndex + 1].textContent) || 0 + parseFloat(amountPerMonth)).toFixed(2);
    }

    // Actualizar el resumen mensual
    updateMonthlyTotals();
});

function updateMonthlyTotals() {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const totals = {};

    // Inicializar el total para cada mes
    months.forEach(month => {
        totals[month] = 0;
    });

    // Calcular los totales por mes
    const rows = document.querySelectorAll('#expensesTable tr');
    rows.forEach(row => {
        for (let i = 1; i < row.children.length; i++) {
            const month = months[i - 1];
            const value = parseFloat(row.children[i].textContent) || 0;
            totals[month] += value;
        }
    });

    // Mostrar los totales mensuales
    const totalsTable = document.getElementById('monthlyTotals');
    totalsTable.innerHTML = '';
    for (const [month, total] of Object.entries(totals)) {
        const row = document.createElement('tr');
        const monthCell = document.createElement('td');
        monthCell.textContent = month;
        const totalCell = document.createElement('td');
        totalCell.textContent = total.toFixed(2); // Redondear a 2 decimales
        row.appendChild(monthCell);
        row.appendChild(totalCell);
        totalsTable.appendChild(row);
    }
}
