export const de = {
  common: {
    app: {
      title: 'Aufgabenliste',
      newTask: 'Neue Aufgabe',
      tasks: 'Aufgaben',
      activeTasks: '{{count}} aktiv',
      completedTasks: '{{count}} erledigt',
      activeTaskTitle: 'Aktive Aufgaben',
      completedTaskTitle: 'Erledigte Aufgaben ({{count}})',
      emptyText: 'Keine Aufgaben verfügbar. Klicken Sie auf "Neue Aufgabe", um eine zu erstellen.',
    },
    task: {
      task: 'Aufgabe',
      addTask: 'Aufgabe Hinzufügen',
      editTask: 'Aufgabe Bearbeiten',
      updateTask: 'Aufgabe Aktualisieren',
      taskDescription: 'Aufgabenbeschreibung eingeben',
      extraDetails: 'Zusätzliche Details eingeben',
      priority: 'Priorität',
      category: 'Kategorie',
      dueDate: 'Fälligkeitsdatum',
      pickDate: 'Datum auswählen',
      noPriority: 'Keine Priorität',
      noCategory: 'Keine Kategorie',
      priorities: {
        high: 'Hoch',
        medium: 'Mittel',
        low: 'Niedrig',
      },
      extraDetailsTitle: 'Zusätzliche Details',
      today: 'Heute',
      tomorrow: 'Morgen',
      highPriority: 'Hohe Priorität',
      mediumPriority: 'Mittlere Priorität',
      lowPriority: 'Niedrige Priorität',
      completed: 'Erledigt',
      active: 'Aktiv',
    },
    category: {
      manageCategories: 'Kategorien Verwalten',
      addNewCategory: 'Neue Kategorie Hinzufügen',
      categoryName: 'Kategoriename',
      existingCategories: 'Bestehende Kategorien',
      default: 'Standard',
    },
    actions: {
      add: 'Hinzufügen',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      save: 'Speichern',
      close: 'Schließen',
      done: 'Fertig',
      tryAgain: 'Erneut Versuchen',
    },
    export: {
      exportData: 'Daten Exportieren',
      jsonFormat: 'JSON-Format',
      csvFormat: 'CSV-Format',
      instructions: 'Wählen Sie ein Format zum Exportieren Ihrer Aufgaben und Kategorien.',
      completeBackup: 'Vollständige Sicherung mit allen Aufgabendetails',
      spreadsheetCompatible: 'Tabellenkalkulationskompatibel für Analysen',
    },
    import: {
      importData: 'Daten Importieren',
      instructions: 'Importieren Sie Aufgaben und Kategorien aus einer zuvor exportierten JSON-Datei.',
      processing: 'Verarbeitung läuft...',
      selectFile: 'JSON-Datei hier ablegen oder zum Durchsuchen klicken',
      supportDetails: 'Unterstützt Aufgabenliste-Exportdateien (Version 1.0.0 und höher)',
      importOptions: 'Import-Optionen',
      checkboxLabel: 'Neue IDs für importierte Elemente generieren',
      importItem1a: 'Alle Elemente erhalten neue IDs (sicher, keine Konflikte)',
      importItem1b: 'Elemente behalten ursprüngliche IDs (überschreibt vorhandene Elemente mit gleicher ID)',
      importItem2a: 'Kategorien werden zusammen mit Aufgaben importiert',
      importItem2b: 'Kategorien werden nach ID zusammengeführt oder hinzugefügt, falls neu',
      importItem3a: 'Vorhandene Daten werden nicht beeinflusst',
      importItem3b: 'Übereinstimmende IDs werden mit importierten Daten aktualisiert',
      importSuccessful: 'Import Erfolgreich',
      importFailed: 'Import Fehlgeschlagen',
      invalidJsonFile: 'Bitte wählen Sie eine gültige JSON-Datei.',
      parseError: 'Fehler beim Analysieren der Datei: {{error}}',
      unknownError: 'Unbekannter Fehler',
      invalidJsonFormat: 'Ungültiges JSON-Format',
      errors: {
        invalidFormat: 'Ungültiges Dateiformat. JSON-Daten erwartet.',
        missingVersion: 'Versionsinformationen in Importdatei fehlen.',
        invalidTasks: 'Ungültige oder fehlende Aufgabendaten.',
        invalidCategories: 'Ungültige oder fehlende Kategoriedaten.',
        invalidTaskStructure: 'Ungültige Aufgabenstruktur in Importdaten.',
        invalidCategoryStructure: 'Ungültige Kategoriestruktur in Importdaten.',
        unsupportedVersion:
          'Nicht unterstützte Version: {{version}}. Bitte aktualisieren Sie die Anwendung, um diese Datei zu importieren.',
        importError: 'Import-Fehler: {{error}}',
      },
      success: {
        validImport: 'Gültige Importdaten',
      },
      successMessage: 'Erfolgreich {{action}} {{taskCount}} Aufgaben und {{categoryCount}} Kategorien.',
      actionImported: 'importiert',
      actionImportedUpdated: 'importiert/aktualisiert',
    },
    deleteMode: {
      tasksSelected: '{{count}} Aufgaben ausgewählt',
      deleteSelected: 'Ausgewählte Löschen',
    },
    about: {
      title: 'Über Aufgabenliste',
      appName: 'Aufgabenliste',
      description:
        'Eine moderne, elegante Desktop-Aufgabenanwendung, erstellt mit Electron, React und TypeScript. Organisieren Sie Ihre Aufgaben mit Kategorien, Prioritäten, Fälligkeitsdaten und Drag-and-Drop-Funktionalität.',
      version: 'Version {{version}}',
      github: 'Auf GitHub ansehen',
      discord: 'Discord beitreten',
      feedbackTitle: 'Feedback & Fehlerberichte',
      feedbackText:
        'Haben Sie einen Fehler gefunden oder eine Funktionsanfrage? Bitte melden Sie es in unserer Discord-Community für die schnellste Antwort.',
      createdBy: 'Erstellt von',
    },
  },
  menu: {
    title: 'Aufgabenliste',
    file: 'Datei',
    newTask: 'Neue Aufgabe',
    language: 'Sprache',
    english: 'Englisch',
    spanish: 'Spanisch',
    french: 'Französisch',
    german: 'Deutsch',
    portuguese: 'Portugiesisch',
    japanese: 'Japanisch',
    chinese: 'Chinesisch',
    korean: 'Koreanisch',
    italian: 'Italienisch',
    dutch: 'Niederländisch',
    manageCategories: 'Kategorien Verwalten',
    deleteMode: 'Löschmodus',
    import: 'Importieren',
    importJson: 'JSON Importieren',
    export: 'Exportieren',
    exportAsJson: 'Als JSON Exportieren',
    exportAsCsv: 'Als CSV Exportieren',
    quit: 'Beenden',
    edit: 'Bearbeiten',
    view: 'Ansicht',
    window: 'Fenster',
    help: 'Hilfe',
    about: 'Über Aufgabenliste',
    hide: 'Aufgabenliste Ausblenden',
    reload: 'Neu Laden',
    forceReload: 'Neu Laden Erzwingen',
    actualSize: 'Tatsächliche Größe',
    zoomIn: 'Vergrößern',
    zoomOut: 'Verkleinern',
    toggleFullscreen: 'Vollbild Umschalten',
    developerTools: 'Entwicklertools',
    minimize: 'Minimieren',
    close: 'Schließen',
    toggleDarkMode: 'Dunklen Modus Umschalten',
    bringAllToFront: 'Alle in den Vordergrund',
    discordCommunity: 'Discord-Community',
    githubRepository: 'GitHub-Repository',
    undo: 'Rückgängig',
    redo: 'Wiederholen',
    cut: 'Ausschneiden',
    copy: 'Kopieren',
    paste: 'Einfügen',
    selectAll: 'Alles Auswählen',
  },
}
