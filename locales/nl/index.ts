export const nl = {
  common: {
    app: {
      title: 'Takenlijst',
      newTask: 'Nieuwe Taak',
      tasks: 'Taken',
      activeTasks: '{{count}} actief',
      completedTasks: '{{count}} voltooid',
      activeTaskTitle: 'Actieve Taken',
      completedTaskTitle: 'Voltooide Taken ({{count}})',
      emptyText: 'Geen taken beschikbaar. Klik op "Nieuwe Taak" om er een te maken.',
    },
    task: {
      task: 'Taak',
      addTask: 'Taak Toevoegen',
      editTask: 'Taak Bewerken',
      updateTask: 'Taak Bijwerken',
      taskDescription: 'Voer taakbeschrijving in',
      extraDetails: 'Voer extra details in',
      priority: 'Prioriteit',
      category: 'Categorie',
      dueDate: 'Vervaldatum',
      pickDate: 'Kies een datum',
      noPriority: 'Geen Prioriteit',
      noCategory: 'Geen categorie',
      priorities: {
        high: 'Hoog',
        medium: 'Middel',
        low: 'Laag',
      },
      extraDetailsTitle: 'Extra Details',
      today: 'Vandaag',
      tomorrow: 'Morgen',
      highPriority: 'Hoge prioriteit',
      mediumPriority: 'Middel prioriteit',
      lowPriority: 'Lage prioriteit',
      completed: 'Voltooid',
      active: 'Actief',
    },
    category: {
      manageCategories: 'Categorieën Beheren',
      addNewCategory: 'Nieuwe Categorie Toevoegen',
      categoryName: 'Categorienaam',
      existingCategories: 'Bestaande Categorieën',
      default: 'Standaard',
    },
    actions: {
      add: 'Toevoegen',
      cancel: 'Annuleren',
      delete: 'Verwijderen',
      edit: 'Bewerken',
      save: 'Opslaan',
      close: 'Sluiten',
      done: 'Klaar',
      tryAgain: 'Opnieuw Proberen',
    },
    export: {
      exportData: 'Gegevens Exporteren',
      jsonFormat: 'JSON Formaat',
      csvFormat: 'CSV Formaat',
      instructions: 'Kies een formaat om uw taken en categorieën te exporteren.',
      completeBackup: 'Volledige back-up met alle taakdetails',
      spreadsheetCompatible: 'Spreadsheet-compatibel voor analyse',
    },
    import: {
      importData: 'Gegevens Importeren',
      instructions: 'Importeer taken en categorieën uit een eerder geëxporteerd JSON-bestand.',
      processing: 'Verwerken...',
      selectFile: 'Sleep uw JSON-bestand hier of klik om te bladeren',
      supportDetails: 'Ondersteunt Takenlijst exportbestanden (versie 1.0.0 en hoger)',
      importOptions: 'Import Opties',
      checkboxLabel: "Genereer nieuwe ID's voor geïmporteerde items",
      importItem1a: "Alle items krijgen nieuwe ID's (veilig, geen conflicten)",
      importItem1b: "Items behouden originele ID's (overschrijft bestaande items met zelfde ID)",
      importItem2a: 'Categorieën worden samen met taken geïmporteerd',
      importItem2b: 'Categorieën worden samengevoegd op ID of toegevoegd indien nieuw',
      importItem3a: 'Bestaande gegevens worden niet beïnvloed',
      importItem3b: "Overeenkomende ID's worden bijgewerkt met geïmporteerde gegevens",
      importSuccessful: 'Import Succesvol',
      importFailed: 'Import Mislukt',
      invalidJsonFile: 'Selecteer een geldig JSON-bestand.',
      parseError: 'Fout bij het parseren van bestand: {{error}}',
      unknownError: 'Onbekende fout',
      invalidJsonFormat: 'Ongeldig JSON-formaat',
      errors: {
        invalidFormat: 'Ongeldig bestandsformaat. JSON-gegevens verwacht.',
        missingVersion: 'Versie-informatie ontbreekt in importbestand.',
        invalidTasks: 'Ongeldige of ontbrekende taakgegevens.',
        invalidCategories: 'Ongeldige of ontbrekende categoriegegevens.',
        invalidTaskStructure: 'Ongeldige taakstructuur in importgegevens.',
        invalidCategoryStructure: 'Ongeldige categoriestructuur in importgegevens.',
        unsupportedVersion: 'Niet-ondersteunde versie: {{version}}. Update de applicatie om dit bestand te importeren.',
        importError: 'Import fout: {{error}}',
      },
      success: {
        validImport: 'Geldige importgegevens',
      },
      successMessage: '{{action}} succesvol {{taskCount}} taken en {{categoryCount}} categorieën.',
      actionImported: 'geïmporteerd',
      actionImportedUpdated: 'geïmporteerd/bijgewerkt',
    },
    deleteMode: {
      tasksSelected: '{{count}} taken geselecteerd',
      deleteSelected: 'Geselecteerde Verwijderen',
    },
    about: {
      title: 'Over Takenlijst',
      appName: 'Takenlijst',
      description:
        'Een moderne, elegante desktop takentoepassing gebouwd met Electron, React en TypeScript. Organiseer uw taken met categorieën, prioriteiten, vervaldatums en drag-and-drop functionaliteit.',
      version: 'Versie {{version}}',
      github: 'Bekijken op GitHub',
      discord: 'Lid Worden van Discord',
      feedbackTitle: 'Feedback & Bugrapporten',
      feedbackText:
        'Een bug gevonden of een functieverzoek? Rapporteer het in onze Discord-gemeenschap voor de snelste reactie.',
      createdBy: 'Gemaakt door',
    },
  },
  menu: {
    title: 'Takenlijst',
    file: 'Bestand',
    newTask: 'Nieuwe Taak',
    language: 'Taal',
    english: 'Engels',
    spanish: 'Spaans',
    french: 'Frans',
    german: 'Duits',
    portuguese: 'Portugees',
    japanese: 'Japans',
    chinese: 'Chinees',
    korean: 'Koreaans',
    italian: 'Italiaans',
    dutch: 'Nederlands',
    manageCategories: 'Categorieën Beheren',
    deleteMode: 'Verwijdermodus',
    import: 'Importeren',
    importJson: 'JSON Importeren',
    export: 'Exporteren',
    exportAsJson: 'Exporteren als JSON',
    exportAsCsv: 'Exporteren als CSV',
    quit: 'Afsluiten',
    edit: 'Bewerken',
    view: 'Weergave',
    window: 'Venster',
    help: 'Help',
    about: 'Over Takenlijst',
    hide: 'Takenlijst Verbergen',
    reload: 'Herladen',
    forceReload: 'Geforceerd Herladen',
    actualSize: 'Werkelijke Grootte',
    zoomIn: 'Inzoomen',
    zoomOut: 'Uitzoomen',
    toggleFullscreen: 'Volledig Scherm Omschakelen',
    developerTools: 'Ontwikkelaarstools',
    minimize: 'Minimaliseren',
    close: 'Sluiten',
    toggleDarkMode: 'Donkere Modus Omschakelen',
    bringAllToFront: 'Alles Naar Voorgrond',
    discordCommunity: 'Discord Gemeenschap',
    githubRepository: 'GitHub Repository',
    undo: 'Ongedaan Maken',
    redo: 'Opnieuw',
    cut: 'Knippen',
    copy: 'Kopiëren',
    paste: 'Plakken',
    selectAll: 'Alles Selecteren',
  },
}
