ChronAlchemy is a cannabis strain lineage simulator and discovery game. It allows users to collect base landrace strains and combine them through an alchemy-inspired crafting system to discover hundreds of unique hybrids across five generations. The application features a deep data model for strain attributes, a force-directed constellation map for visualizing genetic relationships, and a detailed encyclopedia with flavor profile visualizations.

Core Concepts
The system revolves around the genetic progression of cannabis strains. Users start with Gen 0 (Landrace) strains and use the combine() function to generate new entities.

Strains: The primary data entity, containing botanical data, chemical profiles (THC/CBD), and lineage.
Recipes: A lookup table that defines which two parent strains produce a specific offspring.
Discovery: A persistence layer that tracks which strains a user has successfully "crafted."
Visualization: Real-time rendering of genetic trees and spatial relationships using HTML5 Canvas.
System Mapping: Natural Language to Code Entities
The following diagram bridges the conceptual game mechanics to the specific code identifiers and file locations.

Diagram: System Entity Mapping

















Sources: 
index.js
#6-23
 
index.html
#1255-1270

Tech Stack & Architecture
ChronAlchemy is built as a highly portable, single-page application (SPA) with minimal external dependencies.

Frontend: Vanilla HTML5, CSS3, and JavaScript (ES6+).
Storage: Client-side localStorage for session persistence and game state.
Graphics: Dual-engine approach using standard DOM for the UI and HTML5 Canvas for the Strain Encyclopedia and Constellation Map.
Design: A custom CSS design system driven by CSS variables (--bg, --accent, etc.) defined in the :root selector.
For details on the single-file structure and global module pattern, see Getting Started & Architecture.

Diagram: Application Flow




Sources: 
index.html
#9-13
 
index.js
#6-8
 
index.js
#1255-1280

Codebase Organization
The codebase is organized into a primary index.html containing the structure and styles, and an index.js (or inline script) containing the logic.


Component	Responsibility	Key Symbols
Data Layer	Defines all 200+ strains and their recipes.	STRAINS, RECIPE_INDEX
Auth System	Manages guest and registered user sessions.	handleAuth, guestLogin, hashPass
Crafting Engine	Validates combinations and updates discovery state.	combine, discovered, checkRecipe
UI Controller	Handles filtering, searching, and modal navigation.	filterCollection, setFilter, openEncyclopedia
Visualizers	Renders the lineage tree and constellation map.	drawFlavorWheel, smapRender, buildSmapGraph
Data Model Overview
The heart of the application is the STRAINS global object. Every strain is assigned a generation (0–5) and a type (Indica, Sativa, Hybrid, or Landrace). For details on the fields and the ID formation logic, see Strain Data Model.

Sources: 
index.js
#1-23
 
index.html
#1255-1280

Subsystems
Game Mechanics
The core loop involves moving strains from the Collection Panel into the Craft Area. The system uses a normalized alphabetical key check against the RECIPE_INDEX to determine if a combination is valid.

Persistence: Handled via saveGameState and checkSession.
Feedback: Provided via the Notification system and spawnParticles function.
Visualization Subsystems
Strain Encyclopedia: A slide-in panel featuring a recursive ancestral lineage tree and a "Flavor Wheel" radar chart.
Strain Constellation Map: A force-directed graph that visualizes the entire "Strain-verse," allowing users to see how their discoveries connect to undiscovered nodes.
Sources: 
index.html
#61-80
 
index.js
#10-23
