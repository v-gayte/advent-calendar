const calendar = document.getElementById('calendar');

// Charger les surprises depuis le fichier JSON
async function loadSurprises() {
    try {
        const response = await fetch('surprises.json');
        const surprises = await response.json();
        createCalendar(surprises);
    } catch (error) {
        console.error('Erreur de chargement des surprises:', error);
    }
}

// Fonction pour mélanger un tableau (algorithme Fisher-Yates)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function createCalendar(surprises) {
    // Créer un tableau avec les numéros de 1 à 24 et le mélanger
    const dayNumbers = Array.from({ length: 24 }, (_, i) => i + 1);
    const shuffledDays = shuffleArray(dayNumbers);
    
    // Créer les 24 cases
    for (let i = 0; i < 24; i++) {
        const dayNumber = shuffledDays[i];
        const day = document.createElement('div');
        day.className = 'day';
        day.dataset.day = dayNumber;
        
        const dayNumberDiv = document.createElement('div');
        dayNumberDiv.className = 'day-number';
        dayNumberDiv.textContent = dayNumber;
        
        const surprise = document.createElement('div');
        surprise.className = 'surprise';
        
        const surpriseData = surprises[dayNumber - 1];
        surprise.innerHTML = `
            <div class="surprise-content">
                <p class="surprise-text">${surpriseData.text}</p>
                <img src="${surpriseData.image}" alt="Surprise ${dayNumber}" class="surprise-image">
            </div>
        `;
        
        day.appendChild(dayNumberDiv);
        day.appendChild(surprise);
        
        // Vérifier si la case peut être ouverte
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth() + 1; // Décembre = 12
        
        // Pour tester, décommenter la ligne suivante pour permettre d'ouvrir toutes les cases
        //const canOpen = true;
        const canOpen = currentMonth === 12 && currentDay >= dayNumber;

        if (!canOpen) {
            day.classList.add('locked');
        }
        
        // Vérifier si déjà ouvert (localStorage)
        const opened = localStorage.getItem(`day-${dayNumber}`);
        if (opened === 'true') {
            day.classList.add('opened');
        }
        
        day.addEventListener('click', () => {
            if (!day.classList.contains('locked') && !day.classList.contains('opened')) {
                day.classList.add('opened');
                localStorage.setItem(`day-${dayNumber}`, 'true');
            }
        });
        
        calendar.appendChild(day);
    }
}

function resetCalendar() {
    for (let i = 1; i <= 24; i++) {
        localStorage.removeItem(`day-${i}`);
    }
}

function openAll() {
    for (let i = 1; i <=24; i++){
        localStorage.setItem(`day-${i}`, 'true')
    }
}

// Initialiser le calendrier
loadSurprises();
//resetCalendar();