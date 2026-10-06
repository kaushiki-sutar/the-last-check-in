// ---------- Find the screens and buttons ----------

const welcomeScreen = document.getElementById("welcome-screen");
const receptionScreen = document.getElementById("reception-screen");
const endingScreen = document.getElementById("ending-screen");

const checkInButton = document.getElementById("check-in-btn");
const receptionTitle = document.getElementById("reception-title");

// ---------- Start the game ----------

function startGame() {
    // Hide the opening screen.
    welcomeScreen.hidden = true;

    // Reveal the reception.
    receptionScreen.hidden = false;

    // Keep the ending hidden.
    endingScreen.hidden = true;

    // Move keyboard focus to the new screen's heading.
    receptionTitle.focus({ preventScroll: true });

    // Show the new screen from the top.
    window.scrollTo(0, 0);
}

// Run startGame when the player clicks Check in.
checkInButton.addEventListener("click", startGame);

// ---------- Find the inspection window and its contents ----------

const inspectionDialog = document.getElementById("inspection-dialog");
const inspectionTitle = document.getElementById("inspection-title");
const inspectionDetails = document.getElementById("inspection-details");

const drawerForm = document.getElementById("drawer-form");
const drawerReward = document.getElementById("drawer-reward");

const envelopeButton = document.getElementById("envelope-btn");
const closeInspectionButton = document.getElementById("close-inspection-btn");

// ---------- A reusable function for displaying clues ----------

function openInspection(title, description) {
    // Set the heading and description for the selected object.
    inspectionTitle.textContent = title;
    inspectionDetails.textContent = description;

    // Keep drawer-specific content hidden when reading a clue.
    drawerForm.hidden = true;
    drawerReward.hidden = true;

    // Open the popup above the reception.
    inspectionDialog.showModal();
}

// ---------- Inspect the envelope ----------

function inspectEnvelope() {
    openInspection(
        "The Envelope",
        "The paper feels strangely warm. A message reads: " +
        "“The guests arrived in this order: the moon, the rose, the bird. " +
        "Their rooms will show you the way.”"
    );
}

// ---------- Close the inspection window ----------

function closeInspection() {
    inspectionDialog.close();
}

// ---------- Connect the buttons ----------

envelopeButton.addEventListener("click", inspectEnvelope);
closeInspectionButton.addEventListener("click", closeInspection);

// ---------- Find the remaining clue buttons ----------

const registerButton = document.getElementById("register-btn");
const clockButton = document.getElementById("clock-btn");

// ---------- Inspect the guest register ----------

function inspectRegister() {
    const registerText =
        "Most of the names have faded, but four entries remain:\n\n" +
        "Room 4 — Miss Wren — Symbol: Bird\n" +
        "Room 9 — Mr. Ash — Symbol: None\n" +
        "Room 2 — Mrs. Vale — Symbol: Moon\n" +
        "Room 7 — Dr. Thorn — Symbol: Rose\n\n" +
        "At the bottom, someone has written:\n" +
        "“Follow their arrival, not the order on this page.”";

    openInspection("Guest Register", registerText);
}

// ---------- Inspect the wall clock ----------

function inspectClock() {
    const clockText =
        "The clock's hands are frozen at 9:15.\n\n" +
        "You lean closer. Tick. Tick. Tick.\n\n" +
        "The sound comes from inside the wall.\n\n" +
        "A small brass plate beneath the clock reads:\n" +
        "“Time is not the key. Remember the guests.”";

    openInspection("Wall Clock", clockText);
}

// ---------- Connect the buttons ----------

registerButton.addEventListener("click", inspectRegister);
clockButton.addEventListener("click", inspectClock);

// ---------- Find the drawer controls ----------

const drawerButton = document.getElementById("drawer-btn");
const drawerCode = document.getElementById("drawer-code");
const codeFeedback = document.getElementById("code-feedback");

// Remember whether the player has unlocked the drawer.
let drawerUnlocked = false;

// ---------- Inspect the drawer ----------

function inspectDrawer() {
    openInspection(
        "The Locked Drawer",
        "The wooden drawer is secured with a three-digit brass lock."
    );

    // Clear any previous entry or feedback.
    drawerCode.value = "";
    codeFeedback.textContent = "";

    if (drawerUnlocked) {
        inspectionTitle.textContent = "The Open Drawer";
        inspectionDetails.textContent =
            "The brass lock hangs open. You already solved its secret.";

        drawerReward.hidden = false;
    } else {
        drawerForm.hidden = false;
        drawerCode.focus();
    }
}

// ---------- Check the submitted code ----------

function checkDrawerCode(event) {
    // Stop the form from submitting and reloading the page.
    event.preventDefault();

    const enteredCode = drawerCode.value.trim();

    if (enteredCode === "274") {
        drawerUnlocked = true;

        inspectionTitle.textContent = "The Open Drawer";
        inspectionDetails.textContent =
            "You turn the final digit. Something clicks inside.";

        drawerForm.hidden = true;
        drawerReward.hidden = false;

        // Move focus away from the form we just hid.
        document.getElementById("collect-key-btn").focus();
    } else {
        codeFeedback.textContent =
            "The lock stays shut. Check the guests’ order and try again.";

        drawerCode.focus();
        drawerCode.select();
    }
}

// ---------- Connect the drawer and form ----------

drawerButton.addEventListener("click", inspectDrawer);
drawerForm.addEventListener("submit", checkDrawerCode);

// ---------- Find the key and exit controls ----------

const collectKeyButton = document.getElementById("collect-key-btn");
const keyStatus = document.getElementById("key-status");
const exitButton = document.getElementById("exit-btn");
const endingTitle = document.getElementById("ending-title");

// Remember whether the player has collected the key.
let hasExitKey = false;

// ---------- Collect the key ----------

function collectKey() {
    // Only allow collection from an unlocked drawer, once.
    if (!drawerUnlocked || hasExitKey) {
        return;
    }

    hasExitKey = true;

    // Update the reception's status text.
    keyStatus.textContent = "Exit key: Collected";

    // Enable the emergency exit.
    exitButton.disabled = false;
    exitButton.textContent = "Use key and escape";

    // Mark the key as collected in the drawer.
    collectKeyButton.textContent = "Key collected";
    collectKeyButton.disabled = true;

    // Return the player to the reception.
    closeInspection();
}

// ---------- Escape the hotel ----------

function escapeHotel() {
    // The player needs the key to escape.
    if (!hasExitKey) {
        return;
    }

    welcomeScreen.hidden = true;
    receptionScreen.hidden = true;
    endingScreen.hidden = false;

    // Move focus to the ending and show the top of the page.
    endingTitle.focus({ preventScroll: true });
    window.scrollTo(0, 0);
}

// ---------- Connect the buttons ----------

collectKeyButton.addEventListener("click", collectKey);
exitButton.addEventListener("click", escapeHotel);

// ---------- Find the restart button ----------

const restartButton = document.getElementById("restart-btn");

// ---------- Reset the game ----------

function restartGame() {
    // Reset the information the game remembers.
    drawerUnlocked = false;
    hasExitKey = false;

    // Reset the drawer input and feedback.
    drawerForm.reset();
    codeFeedback.textContent = "";

    // Hide the drawer's form and reward.
    drawerForm.hidden = true;
    drawerReward.hidden = true;

    // Restore the key collection button.
    collectKeyButton.disabled = false;
    collectKeyButton.textContent = "Collect the exit key";

    // Lock the exit and reset the status.
    exitButton.disabled = true;
    exitButton.textContent = "Exit locked — find the key";
    keyStatus.textContent = "Exit key: Not found";

    // Close the inspection window if it is open.
    if (inspectionDialog.open) {
        inspectionDialog.close();
    }

    // Clear the previous object's details.
    inspectionTitle.textContent = "Inspect object";
    inspectionDetails.textContent = "";

    // Return to the welcome screen.
    receptionScreen.hidden = true;
    endingScreen.hidden = true;
    welcomeScreen.hidden = false;

    // Put keyboard focus on the starting button.
    checkInButton.focus({ preventScroll: true });
    window.scrollTo(0, 0);
}

// ---------- Connect the restart button ----------

restartButton.addEventListener("click", restartGame);