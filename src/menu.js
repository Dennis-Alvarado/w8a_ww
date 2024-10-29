// Function to send the main menu options
function sendMainMenu(client, from) {
    client.sendMessage(from, `
👋 *¡Bienvenid@ a W8A Training and Nutrition!* 💪

Estamos aquí para ayudarte a alcanzar tus metas de *fitness* y *nutrición*.

🔹 *Este formulario tiene 21 preguntas.*
🔹 Puedes salir en cualquier momento usando el comando *salir*.
🔹 Si eres un **usuario nuevo**, selecciona *start* para registrarte.
🔹 Si deseas **actualizar tus datos**, selecciona *update*.

*Comandos disponibles:*
👉 *start* - Iniciar el formulario
👉 *update* - Actualizar tus datos
👉 *planes* - Ver los planes de entrenamiento y nutrición
👉 *help* - Ver comandos disponibles
`);
}

// Function to display information about available plans
function sendPlanInfo(client, from) {
    client.sendMessage(from, `
📋 *Planes de Entrenamiento y Nutrición:*

🟢 **PLAN 1**:
- Asesoría en alimentación (4 dietas por trimestre, cambiando plan cada 3/4 semanas).
- Asesoría en suplementos (mensual).
- Plan de entreno (cada mes).
- *Precio:* $250 por 3 meses

🟢 **PLAN 2**:
- Asesoría en alimentación (6 dietas por trimestre, cambiando plan cada 15 días).
- Asesoría en suplementos de todo tipo (mensual).
- Plan de entreno (cada mes).
- *Precio:* $300 por 3 meses

🟢 **PLAN 3**:
- Asesoría en alimentación (cambio y/o ajustes en el plan alimentario cada semana).
- Asesoría en suplementos (mensualmente o de acuerdo a la necesidad).
- Plan de entreno (cada mes).
- *Precio:* $400 por 3 meses

Para más información o para iniciar tu plan, contáctanos.
`);
}

module.exports = { sendMainMenu, sendPlanInfo };
