const { client, userSession } = require('./whatsappClient');
const { displayUpdateOptions, handleUpdate, finalizeUpdate } = require('./update');
const { checkIfUserExists, appendToSheet } = require('./googleSheets');
const questions = require('./questions'); // Array of form questions
const { sendMainMenu, sendPlanInfo } = require('./menu');

// Listen for incoming messages
client.on('message', async (message) => {
    const from = message.from;
    const body = message.body.trim().toLowerCase();

    // Exit the form process and return to the main menu if the user sends "salir"
    if (body === 'salir' && userSession[from]) {
        client.sendMessage(from, 'Has salido del formulario. Volviendo al menú principal.');
        sendMainMenu(client, from);
        delete userSession[from]; // Reset the session
        return;
    }

    // Handle updates
    if (body === 'update') {
        const userData = await checkIfUserExists(from);

        if (userData) {
            client.sendMessage(from, 'Aquí están tus datos actuales. Elige qué campo deseas actualizar.');
            displayUpdateOptions(client, from, userData);
            userSession[from] = { updating: true, userData, awaitingFieldSelection: true };
        } else {
            client.sendMessage(from, 'No se encontraron datos para actualizar.');
        }
        return;
    }

    // Handle the updating of fields in the form
    const updateHandled = await handleUpdate(client, message, userSession);
    if (updateHandled) return;

    // Start the full form questionnaire
    if (body === 'start') {
        client.sendMessage(from, '¡Hola! Vamos a empezar con el formulario. Por favor responde la siguiente pregunta:\n\n' + questions[0]);
        userSession[from] = { step: 0, answers: [] }; // Initialize session for new user
        return;
    }

    // Progress through the form, asking one question at a time
    if (userSession[from] && userSession[from].step !== undefined) {
        const currentStep = userSession[from].step;

        // Store the answer for the current question
        userSession[from].answers[currentStep] = message.body;

        // Move to the next question
        userSession[from].step += 1;

        // If there are more questions, ask the next one
        if (userSession[from].step < questions.length) {
            client.sendMessage(from, questions[userSession[from].step]);
        } else {
            // If all questions have been answered, save the data to Google Sheets
            const phoneNumber = from; // Phone number for reference
            const values = [phoneNumber, ...userSession[from].answers];

            await appendToSheet(values); // Save to Google Sheets
            client.sendMessage(from, '🎉 ¡Gracias! Tus respuestas han sido registradas correctamente.');
            sendMainMenu(client, from); // Return to the main menu after submission
            delete userSession[from]; // Clear the session after completion
        }
        return;
    }

    // Show plan information if the user types "planes"
    if (body === 'planes') {
        sendPlanInfo(client, from); // Send information about the plans
        return;
    }

    // Show the main menu for unrecognized input
    sendMainMenu(client, from);
});

// Initialize the WhatsApp client
client.initialize();
