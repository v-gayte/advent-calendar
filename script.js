const calendar = document.getElementById('calendar');
const STORAGE_KEY = 'advent_calendar_opened';

// Charger les surprises depuis le fichier JSON
async function loadSurprises() {
    try {
        // AJOUT: ?t=${Date.now()} force le navigateur à ne pas utiliser le cache
        // Cela garantit que si tu fais un commit, les changements sont visibles immédiatement
        const response = await fetch(`surprises.json?t=${Date.now()}`);
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

// Gestion optimisée du LocalStorage
function getOpenedDays() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function markDayAsOpened(dayNumber) {
    const openedDays = getOpenedDays();
    if (!openedDays.includes(dayNumber)) {
        openedDays.push(dayNumber);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(openedDays));
    }
}

function createCalendar(surprises) {
    // Nettoyer le calendrier avant de reconstruire (utile si rappel de la fonction)
    calendar.innerHTML = '';

    const dayNumbers = Array.from({ length: 24 }, (_, i) => i + 1);
    const shuffledDays = shuffleArray(dayNumbers);
    
    // Récupérer la liste des jours déjà ouverts une seule fois au début
    const openedDays = getOpenedDays();
    
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    
    // Pour le test : on simule qu'on est le 24 décembre pour tout tester
    // Remets les lignes ci-dessus en prod et supprime celles ci-dessous
    // const currentDay = 24; 
    // const currentMonth = 12;

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
        
        // ICI : On injecte toujours le contenu frais venant du JSON
        // Même si la case est ouverte, si le JSON a changé, le texte/image changera ici
        const surpriseData = surprises[dayNumber - 1];
        
        // Sécurité : vérifier que la surprise existe dans le JSON
        if (surpriseData) {
            surprise.innerHTML = `
                <div class="surprise-content">
                    <p class="surprise-text">${surpriseData.text}</p>
                    <img src="${surpriseData.image}" alt="Surprise ${dayNumber}" class="surprise-image">
                </div>
            `;
        } else {
            surprise.innerHTML = `<div class="surprise-content"><p>Pas de surprise définie !</p></div>`;
        }
        
        day.appendChild(dayNumberDiv);
        day.appendChild(surprise);
        
        // Logique d'ouverture (Date)
        const canOpen = currentMonth === 12 && currentDay >= dayNumber;

        if (!canOpen) {
            day.classList.add('locked');
        }
        
        // Logique visuelle (Mémoire)
        // On vérifie simplement si le numéro est dans notre liste sauvegardée
        if (openedDays.includes(dayNumber)) {
            day.classList.add('opened');
        }
        
        day.addEventListener('click', () => {
            if (!day.classList.contains('locked') && !day.classList.contains('opened')) {
                day.classList.add('opened');
                // On sauvegarde juste le NUMÉRO, pas le contenu
                markDayAsOpened(dayNumber);
            }
        });
        
        calendar.appendChild(day);
    }
}

// Fonction pour tout réinitialiser (utile pour le debug)
function resetCalendar() {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
}

loadSurprises();