const { updateSheet } = require('./googleSheets');

// Function to display current data and options to update
function displayUpdateOptions(client, from, userData) {
    client.sendMessage(from, `
📝 *Datos Actuales:*

1️⃣ Nombre Completo: ${userData[1]}
2️⃣ Edad: ${userData[2]}
3️⃣ Peso Máximo: ${userData[3]}
4️⃣ Peso Actual: ${userData[4]}
5️⃣ Estatura: ${userData[5]}
6️⃣ Rutina Diaria: ${userData[6]}
7️⃣ Actividad Física: ${userData[7]}
8️⃣ Tiempo Entrenando: ${userData[8]}
9️⃣ Tipo de Entreno: ${userData[9]}
🔟 Numero de entrenos: ${userData[10]}
1️⃣1️⃣ Comidas por Día: ${userData[11]}
1️⃣2️⃣ Desayuno: ${userData[12]}
1️⃣3️⃣ Almuerzo: ${userData[13]}
1️⃣4️⃣ Cena: ${userData[14]}
1️⃣5️⃣ Snacks: ${userData[15]}
1️⃣6️⃣ Alimentos No Consumidos: ${userData[16]}
1️⃣7️⃣ Uso de suplementos: ${userData[17]}
1️⃣8️⃣ Suplementos Usados: ${userData[18]}
1️⃣9️⃣ Patologías: ${userData[19]}
2️⃣0️⃣ Objetivos: ${userData[20]}
2️⃣1️⃣ País: ${userData[21]}

Escribe el número del campo que deseas actualizar.
`);
}

// Handle update logic based on user input
async function handleUpdate(client, message, userSession) {
    const from = message.from;
    const body = message.body.trim().toLowerCase();

    if (userSession[from] && userSession[from].updating && userSession[from].awaitingFieldSelection) {
        const fieldSelection = parseInt(body);
        const fields = ['nombre completo', 'edad', 'peso máximo', 'peso actual', 'estatura', 'rutina diaria', 'actividad física', 'tiempo entrenando', 'tipo de entreno', 'numero de entrenos', 'comidas por día', 'desayuno', 'almuerzo', 'cena', 'snacks', 'alimentos no consumidos', 'uso de suplementos', 'suplementos usados', 'patologías', 'objetivos', 'país'];

        if (fieldSelection >= 1 && fieldSelection <= 21) { 
            userSession[from].selectedField = fieldSelection;
            const fieldName = fields[fieldSelection - 1];  
            client.sendMessage(from, `Por favor, proporciona el nuevo valor para *${fieldName}*.`);
            userSession[from].awaitingFieldSelection = false;
            userSession[from].awaitingNewValue = true;
        } else {
            client.sendMessage(from, 'Selección inválida. Por favor elige un número válido.');
            displayUpdateOptions(client, from, userSession[from].userData);
        }
        return true;
    }

    if (userSession[from] && userSession[from].awaitingNewValue) {
        const newValue = message.body;
        const fieldIndex = userSession[from].selectedField;
        userSession[from].userData[fieldIndex] = newValue;

        const phoneNumber = from;
        const updatedData = userSession[from].userData.slice(0, 22); 

        try {
            const values = [phoneNumber, ...updatedData];
            await updateSheet(phoneNumber, values);
            client.sendMessage(from, 'Dato actualizado correctamente. ¿Deseas actualizar otro campo? (Escribe el número o "salir" para terminar).');

            userSession[from].awaitingFieldSelection = true;
            userSession[from].awaitingNewValue = false;
            displayUpdateOptions(client, from, userSession[from].userData);
        } catch (error) {
            console.error('Error updating Google Sheets:', error);
            client.sendMessage(from, 'Hubo un error al actualizar los datos. Inténtalo de nuevo más tarde.');
        }

        return true;
    }

    return false;
}

module.exports = {
    displayUpdateOptions,
    handleUpdate,
    finalizeUpdate: async (client, from, userSession) => {
        client.sendMessage(from, '¡Has completado la actualización! Los cambios han sido sincronizados con éxito.');
        delete userSession[from];
    }
};
